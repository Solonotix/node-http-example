import 'node';

export interface IEncoding {
  get ascii(): string;

  get base64(): string;

  get base64url(): string;

  get binary(): string;

  get hex(): string;

  get latin1(): string;

  get 'ucs-2'(): string;

  get ucs2(): string;

  get utf16(): string;

  get utf16le(): string;

  get utf8(): string;

  get 'utf-8'(): string;

  toString(encoding?: BufferEncoding): string;
}
