export class FileNotFoundError extends Error {
  constructor(path: string);
  constructor(folder: string, file: string);
  constructor(folder: string, file: string, message: string);
  constructor(folder: string, file?: string, message?: string) {
    const base = `${message ? message.concat('. ') : ''}Unable to locate file`;

    if(file) {
      super(`${base} "${file}" in the path "${folder}".`);
    }
    else {
      super(`${base} "${folder}".`);
    }
  }
}
