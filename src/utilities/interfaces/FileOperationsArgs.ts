import { IFileMapper } from './IFileMapper';

export interface FileOperationsArgs<T> {
  encoding?: BufferEncoding;
  mapper?: IFileMapper<T>;
}
