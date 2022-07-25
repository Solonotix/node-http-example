import { IEncoding } from './interfaces';

export class Encoding implements IEncoding {
  private readonly value: string;

  constructor(value: any) {
    if (value == null) {
      this.value = '';
    }
    else if (typeof value === 'object') {
      this.value = JSON.stringify(value);
    }
    else {
      this.value = value.toString();
    }
  }

  get ascii() {
    return this.toString('ascii');
  }

  get base64() {
    return this.toString('base64');
  }

  get base64url() {
    return this.toString('base64url');
  }

  get binary() {
    return this.toString('binary');
  }

  private get buffer(): Buffer {
    return Buffer.from(this.value);
  }

  get hex() {
    return this.toString('hex');
  }

  get latin1() {
    return this.toString('latin1');
  }

  get ['ucs-2']() {
    return this.ucs2;
  }

  get ucs2() {
    return this.toString('ucs2');
  }

  get utf16() {
    return this.utf16le;
  }

  get utf16le() {
    return this.toString('utf16le');
  }

  get ['utf-8']() {
    return this.utf8;
  }

  get utf8() {
    return this.toString('utf8');
  }

  toString(encoding?: BufferEncoding) {
    return encoding ? this.buffer.toString(encoding) : this.buffer.toString();
  }
}
