import { IFromJsonOptions } from './interfaces';
import { Encoding } from './Encoding';

String.camelize = function (value: string): string {
  return value
    .toLowerCase()
    .split(/[^\da-z]/i)
    .filter(word => word > '')
    .map((str, i) => (i === 0 ? str : str.replace(/(^\w|[A-Z])/, letter => letter.toUpperCase())))
    .join('');
};

String.fromJson = function (value: any, options?: IFromJsonOptions): string {
  const { replacer, space } = options ?? {};

  return JSON.stringify(value, replacer, space);
};

String.prototype.toCamelCase = function (this: string): string {
  return String.camelize(this);
};

Object.defineProperty(String.prototype, 'encoded', {
  configurable: false,
  enumerable: false,
  get: function (this: string) {
    return new Encoding(this);
  }
});

Object.defineProperty(String.prototype, 'ascii', {
  configurable: false,
  enumerable: false,
  get: function (this: string) {
    return this.encoded.ascii;
  }
});

Object.defineProperty(String.prototype, 'base64', {
  configurable: false,
  enumerable: false,
  get: function (this: string) {
    return this.encoded.base64;
  }
});

Object.defineProperty(String.prototype, 'base64url', {
  configurable: false,
  enumerable: false,
  get: function (this: string) {
    return this.encoded.base64url;
  }
});

Object.defineProperty(String.prototype, 'binary', {
  configurable: false,
  enumerable: false,
  get: function (this: string) {
    return this.encoded.binary;
  }
});

Object.defineProperty(String.prototype, 'hex', {
  configurable: false,
  enumerable: false,
  get: function () {
    return this.encoded.hex;
  }
});

Object.defineProperty(String.prototype, 'isJson', {
  configurable: false,
  enumerable: false,
  get: function (this: string) {
    try {
      JSON.parse(this);
      return true;
    } catch {
      return false;
    }
  }
});

Object.defineProperty(String.prototype, 'isInteger', {
  configurable: false,
  enumerable: false,
  get: function () {
    return Number.isInteger(this.toNumber());
  }
});

Object.defineProperty(String.prototype, 'latin1', {
  configurable: false,
  enumerable: false,
  get: function (this: string) {
    return this.encoded.latin1;
  }
});

String.prototype.padCenter = function (this: string, maxLength: number, fillString?: string): string {
  if (maxLength < this.length) {
    return this;
  }

  const remaining = maxLength - this.length;
  const leading = Math.round(remaining / 2) + this.length;
  return this.padStart(leading, fillString).padEnd(maxLength, fillString);
};

String.prototype.toInteger = function (this: string): number {
  return Math.round(this.toNumber());
};

String.prototype.toNumber = function (this: string): number {
  return Number(this);
};

Object.defineProperty(String.prototype, 'ucs-2', {
  configurable: false,
  enumerable: false,
  get: function (this: string) {
    return this.encoded.ucs2;
  }
});

Object.defineProperty(String.prototype, 'ucs2', {
  configurable: false,
  enumerable: false,
  get: function (this: string) {
    return this.encoded.ucs2;
  }
});

Object.defineProperty(String.prototype, 'utf16', {
  configurable: false,
  enumerable: false,
  get: function (this: string) {
    return this.encoded.utf16le;
  }
});

Object.defineProperty(String.prototype, 'utf16le', {
  configurable: false,
  enumerable: false,
  get: function (this: string) {
    return this.encoded.utf16le;
  }
});

Object.defineProperty(String.prototype, 'utf-8', {
  configurable: false,
  enumerable: false,
  get: function (this: string) {
    return this.encoded.utf8;
  }
});

Object.defineProperty(String.prototype, 'utf8', {
  configurable: false,
  enumerable: false,
  get: function (this: string) {
    return this.encoded.utf8;
  }
});
