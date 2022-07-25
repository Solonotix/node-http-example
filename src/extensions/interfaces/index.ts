import { DateUnits } from './DateUnits';
import { IEncoding } from './IEncoding';
import { IFromJsonOptions } from './IFromJsonOptions';
import { IUtcValue } from './IUtcValue';

declare global {
  interface BigInt {
    between(this: bigint, a: bigint, b: bigint): boolean;

    divide(divisor: bigint): [bigint, bigint];

    power(exp?: bigint): bigint;
  }

  interface BigIntConstructor {
    new (value?: any): bigint;

    between(val: bigint, a: bigint, b: bigint): boolean;

    divide(dividend: bigint, divisor: bigint): [bigint, bigint];

    power(num: bigint, exp?: bigint): bigint;
  }

  interface Date {
    get date(): number;

    set date(value: number);

    /**
     * Sunday - Saturday : 0 - 6
     */
    get dayOfWeek(): number;

    dateMath(units: DateUnits): Date;

    format(format: Intl.DateTimeFormatOptions, locale?: string): string;

    get hours(): number;

    set hours(value: number);

    get minutes(): number;

    set minutes(value: number);

    get milliseconds(): number;

    set milliseconds(value: number);

    get month(): number;

    set month(value: number);

    get seconds(): number;

    set seconds(value: number);

    get time(): number;

    set time(value: number);

    get utc(): IUtcValue;

    get year(): number;

    set year(value: number);
  }

  interface DateConstructor {
    new (): Date;

    dateMath(dt: Date | number | string, units: DateUnits): Date;
  }

  interface Number {
    between(this: number, a: number, b: number): boolean;
  }

  interface NumberConstructor {
    new (value?: any): number;

    between(val: number, a: number, b: number): boolean;
  }

  interface StringConstructor {
    new (value?: any): string;

    camelize(value: string): string;

    fromJson(value: any, option?: IFromJsonOptions): string;
  }

  interface String {
    ascii: string;

    base64: string;

    base64url: string;

    binary: string;

    encoded: IEncoding;

    hex: string;

    isJson: boolean;

    isInteger: boolean;

    latin1: string;

    padCenter(maxLength: number, fillString?: string): string;

    toCamelCase(): string;

    toInteger(): number;

    toNumber(): number;

    ['ucs-2']: string;

    ucs2: string;

    utf16: string;

    utf16le: string;

    ['utf-8']: string;

    utf8: string;
  }
}

export { DateUnits, IEncoding, IFromJsonOptions };
