export class UtcValue {
  private _dt: Date;

  constructor(dt: Date) {
    this._dt = dt;
  }

  get date(): number {
    return this._dt.getUTCDate();
  }

  set date(value: number) {
    this._dt.setUTCDate(value);
  }

  get fullYear(): number {
    return this._dt.getUTCFullYear();
  }

  set fullYear(value: number) {
    this._dt.setUTCFullYear(value);
  }

  get hours(): number {
    return this._dt.getUTCHours();
  }

  set hours(value: number) {
    this._dt.setUTCHours(value);
  }

  get milliseconds(): number {
    return this._dt.getUTCMilliseconds();
  }

  set milliseconds(value: number) {
    this._dt.setUTCMilliseconds(value);
  }

  get minutes(): number {
    return this._dt.getUTCMinutes();
  }

  set minutes(value: number) {
    this._dt.setUTCMinutes(value);
  }

  get month(): number {
    return this._dt.getUTCMonth() + 1;
  }

  set month(value: number) {
    this._dt.setUTCMonth(value - 1);
  }

  get seconds(): number {
    return this._dt.getUTCSeconds();
  }

  set seconds(value: number) {
    this._dt.setUTCSeconds(value);
  }

  get year(): number {
    return this.fullYear;
  }

  set year(value: number) {
    this.fullYear = value;
  }
}
