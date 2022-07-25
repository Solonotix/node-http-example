import { platform as getPlatform } from 'os';
import { basename, dirname, join, parse, ParsedPath, resolve, sep as pathSep } from 'path';
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmdirSync,
  Stats,
  statSync,
  unlinkSync,
  writeFileSync
} from 'fs';
import { promisify } from 'util';

import { ncp as _ncp, Options as CopyOptions } from 'ncp';

import { FileNotFoundError } from '../errors';

import { FileOperationsArgs, IFileMapper } from './interfaces';

const ncp = promisify(_ncp);
const platform = getPlatform();

function parseJson<T>(content: string|Buffer): T {
  return JSON.parse(content.toString());
}

export class FileOperations<T> {
  readonly path: string;
  readonly parts: ParsedPath;
  readonly mapper: IFileMapper<T>;
  readonly encoding: BufferEncoding;

  /**
   *
   * @param {string} value Path to file
   * @param {IFileMapper} mapper Callback to parse the file contents
   * @param {string} encoding Expected encoding used in the file
   */
  constructor(value: string, { mapper = parseJson, encoding = 'utf-8' }: FileOperationsArgs<T> = {}) {
    this.path = resolve(value);
    this.parts = parse(this.path);
    this.mapper = mapper;
    this.encoding = encoding;
  }

  /**
   * Concatenates multiple paths into a single absolute path
   * @param {string} paths
   * @return {string}
   */
  append(...paths: string[]): string {
    return resolve(this.path, ...paths);
  }

  child<U = T>(path: string, encoding?: BufferEncoding, mapper?: IFileMapper<U>): FileOperations<U> {
    return new FileOperations<U>(this.append(path), { mapper, encoding });
  }

  /**
   *
   * @param {string} source
   * @param {string} destination
   * @param {object} options
   * @return {Promise}
   */
  static copy(source: string, destination: string, options?: CopyOptions) {
    const ops = new FileOperations(source);

    if (options) {
      return ops.copyTo(destination, options);
    }

    return ops.copyTo(destination);
  }

  copyTo(destination: string, options?: CopyOptions) {
    return options ? ncp(this.path, destination, options) : ncp(this.path, destination);
  }

  copyFrom(source: string, options?: CopyOptions) {
    return options ? ncp(source, this.path, options) : ncp(source, this.path);
  }

  /**
   * Checks if the provided path exists
   * @return {boolean}
   */
  get exists(): boolean {
    return existsSync(this.path);
  }

  static exists(...parts: string[]): boolean {
    const cwd = parts.shift() ?? '.';
    const path = FileOperations.resolvePath(cwd, ...parts);
    return new FileOperations(path).exists;
  }

  get allFiles(): string[] {
    return this.allFileOps.map(fileOps => fileOps.path);
  }

  get allFileOps(): FileOperations<T>[] {
    if (!this.isDirectory) {
      return [ this ];
    }

    const contents = [];

    for(const file of readdirSync(this.path)) {
      contents.push(...this.child(file).allFileOps);
    }

    return contents as FileOperations<T>[];
  }

  /**
   * Retrieve fully-qualified paths to the contents of the current path
   * @return {string[]}
   */
  get files(): string[] {
    return this.fileOps.map(fileOps => fileOps.path);
  }

  /**
   * Retrieve a new FileOperations instance for each file contained within the current path
   * @return {FileOperations[]}
   */
  get fileOps(): FileOperations<T>[] {
    if (!this.isDirectory) {
      return [ this ];
    }

    const contents: FileOperations<T>[] = [];

    for(const file of readdirSync(this.path)) {
      const child = this.child(file);
      if (child.isFile) {
        contents.push(...this.child(file).fileOps);
      }
    }

    return contents;
  }

  /**
   * Returns the first file found given the provided path
   * @return {string|null}
   */
  get firstFile(): string | null {
    for (const file of this.fileOps) {
      if (file.exists) {
        return file.path;
      }
    }

    return null;
  }

  /**
   * Returns the first file found given the provided paths
   * @param {string} files
   * @return {string|null}
   */
  static firstFile(...files: string[]): string | null {
    return files.find(existsSync) || null;
  }

  firstFileInDirectory(ext?: string|RegExp): string|null {
    if(this.isFile) {
      if(ext instanceof RegExp) {
        return ext.test(this.path) ? this.path : null;
      }

      return this.path.includes(`${ext}`) ? this.path : null;
    }

    return FileOperations.firstFileInDirectory(this.path, ext);
  }

  /**
   * Returns the first file in a given directory, optionally matching to a given RegExp/string
   * @param {string} folder Path to look in
   * @param {string|RegExp} ext Extension to check for, or other valid RegExp
   * @return {string|null}
   */
  static firstFileInDirectory(folder: string, ext?: string|RegExp): string | null {
    if (!folder) {
      return null;
    }

    ext = ext || /.+/;
    ext = !(ext instanceof RegExp) ? new RegExp(ext.replace(/\./, '\\.'), 'i') : ext;

    for (const filePath of new FileOperations(folder).files) {
      if (ext.test(filePath)) {
        return filePath;
      }
    }

    return null;
  }

  /**
   * Attempts to find the first of a list of files, and throws an exception if none can be found
   * @param {string} error
   * @param {string[]} files
   * @return {string}
   */
  static firstFileWithError(error: string, ...files: string[]): string {
    const result = FileOperations.firstFile(...files);

    if (result) {
      return result;
    }

    const absolutePath = resolve(files.pop() ?? './<unknown>');
    throw new FileNotFoundError(dirname(absolutePath), basename(absolutePath), error);
  }

  glob(pattern: string): FileOperations<T>[] {
    const re = new RegExp(
      pattern.replace(/[./$^+()=!|]/g, v => `\\${v}`)
        .replace(/\*/g, '.*')
        .replace(/\?/g, '.')
        .replace(/[{}]/g, v => v === '{' ? '(' : ')')
        .replace(/\(.+,.+\)/g, v => v.replace(',', '|'))
    );

    return this.fileOps.filter(file => re.test(file.path));
  }

  static glob(pattern: string) {
    return new FileOperations('.').glob(pattern);
  }

  /**
   * Was the provided path a directory
   * @return {boolean}
   */
  get isDirectory(): boolean {
    return this.stats.isDirectory();
  }

  /**
   * Was the provided path a file
   * @return {boolean}
   */
  get isFile(): boolean {
    return this.stats.isFile();
  }

  /**
   * Was the provided path a file
   * @param {string} filePath
   * @return {boolean}
   */
  static isFile(filePath: string): boolean {
    return new FileOperations(filePath).isFile;
  }

  mkdir(): this {
    if(!this.exists) {
      mkdirSync(this.path);
    }

    return this;
  }

  static mkdir(path: string): FileOperations<any> {
    return new FileOperations(path).mkdir();
  }

  mkdirp(): FileOperations<T> {
    const { mapper, encoding } = this;
    return FileOperations.mkdirp<T>(this.path, { mapper, encoding });
  }

  static mkdirp<T = any>(path: string, options?: FileOperationsArgs<T>): FileOperations<T> {
    // In Windows, base will be the drive mount letter, and rootDir will be the target folder
    const [ base, rootDir, ...parts ] = path.split(pathSep);
    // CWD must start from a folder within the drive, since mkdir cannot create a drive mount
    //    For Linux, the path fully-qualified path leads with the path separator, so base is empty and rootDir is the
    //        first folder to be created. A name without a preceding slash is treated as relative to the process.cwd()
    const cwd = platform === 'win32' ? join(base, rootDir) : `${pathSep}${rootDir}`;
    // Ensure that the CWD starting point has been created before iterating down the tree
    FileOperations.mkdir(cwd);

    // arr.slice(0, 0) returns [], so starting at index of 1 to leverage slice
    //   attempted to use a loop of shifting elements out of the array, but it added unnecessary complexity to the check
    for(let i = 1; i <= parts.length; i++) {
      const _path = resolve(cwd, ...parts.slice(0, i));
      FileOperations.mkdir(_path);
    }

    return new FileOperations(path, options);
  }

  /**
   * Given the provided path, encoding and [mapper]{@link IFileMapper} function, returns the resulting object if it exists
   * @return {object}
   */
  get object(): T {
    if (this.exists) {
      return this.mapper(readFileSync(this.path, this.encoding)) as T;
    }

    return {} as T;
  }

  /**
   * Given the provided path, encoding and [mapper]{@link IFileMapper} function, returns the resulting object if it exists
   * @param {string} filePath
   * @param {string} encoding
   * @param {IFileMapper} mapper
   * @return {object}
   */
  static objectify<V>(filePath: string, encoding: BufferEncoding = 'utf-8', mapper: IFileMapper<V> = parseJson): V {
    return new FileOperations<V>(filePath, { mapper, encoding }).object;
  }

  static pathMapper(folder: string) {
    return (file: string) => resolve(folder, file);
  }

  static recurseOut(dir: string, file: string): string | null {
    try {
      const folder = existsSync(dir) ? resolve(dir) : FileOperations.recurseOut(dirname(resolve(dir)), basename(resolve(dir)));

      if (!folder) {
        return null;
      }

      const contents = readdirSync(folder);

      if (contents.includes(file)) {
        return resolve(dir, file);
      }

      const parent = dirname(dir);

      if (parent !== folder && existsSync(parent)) {
        return FileOperations.recurseOut(parent, file);
      }

      return null;
    }
    catch(error) {
      return null;
    }
  }

  remove(): this {
    if(!this.exists) {
      return this;
    }

    if(this.isFile) {
      unlinkSync(this.path);
    }
    else if(this.isDirectory) {
      for(const fileOps of this.fileOps) {
        fileOps.remove();
      }

      rmdirSync(this.path);
    }

    return this;
  }

  static remove(...parts: string[]): FileOperations<any> {
    const cwd = parts.shift() ?? '.';
    const path = FileOperations.resolvePath(cwd, ...parts);
    return new FileOperations(path).remove();
  }

  static resolvePath(cwd: string, ...parts: string[]) {
    return resolve(cwd, ...parts);
  }

  /**
   * Retrieve stats about the provided path
   * @return {Stats}
   */
  get stats(): Stats {
    return statSync(this.path);
  }

  toString(): string {
    return this.path;
  }

  write(content: string, encoding: BufferEncoding = 'utf-8') {
    return writeFileSync(this.path, content, encoding);
  }

  writeJson(content: object, encoding: BufferEncoding = 'utf-8', space = 2, replacer?: Array<string | number>): void {
    return writeFileSync(this.path, JSON.stringify(content, replacer, space), encoding);
  }

  static writeJson(path: string, content: object, encoding: BufferEncoding = 'utf-8', space = 2, replacer?: Array<string | number>): void {
    return new FileOperations(path).writeJson(content, encoding, space, replacer);
  }
}
