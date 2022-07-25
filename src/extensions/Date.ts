import { DateUnits } from './interfaces';
import { UtcValue } from './UtcValue';

Object.defineProperty(Date.prototype, 'utc', {
  enumerable: false,
  get: function utc() {
    return new UtcValue(this);
  }
});

Date.dateMath = function dateMath(dt?: Date | number | string, units: DateUnits = {}): Date {
  const { years, months, days, hours, minutes, seconds, milliseconds } = units;

  dt = dt instanceof Date ? dt : new Date(dt ?? Date.now());

  dt = years ? new Date(dt.setFullYear(dt.getFullYear() + years)) : dt;
  dt = months ? new Date(dt.setMonth(dt.getMonth() + months)) : dt;
  dt = days ? new Date(dt.setDate(dt.getDate() + days)) : dt;
  dt = hours ? new Date(dt.setHours(dt.getHours() + hours)) : dt;
  dt = minutes ? new Date(dt.setMinutes(dt.getMinutes() + minutes)) : dt;
  dt = seconds ? new Date(dt.setSeconds(dt.getSeconds() + seconds)) : dt;
  dt = milliseconds ? new Date(dt.setMilliseconds(dt.getMilliseconds() + milliseconds)) : dt;

  return dt;
};

Date.prototype.dateMath = function dateMath(units: DateUnits = {}): Date {
  return Date.dateMath(this, units);
};

Date.prototype.format = function (format: Intl.DateTimeFormatOptions, locale = 'en-us'): string {
  return new Intl.DateTimeFormat(locale, format).format(this);
};

Object.defineProperty(Date.prototype, 'date', {
  enumerable: true,
  /**
   *
   * @return {number}
   */
  get() {
    return this.getDate();
  },
  /**
   *
   * @param {number} value
   * @return {void}
   */
  set(value) {
    this.setDate(value);
  }
});

Object.defineProperty(Date.prototype, 'dayOfWeek', {
  enumerable: true,
  /**
   * Sunday - Saturday : 0 - 6
   * @return {number}
   */
  get() {
    return this.getDay();
  }
});

Object.defineProperty(Date.prototype, 'hours', {
  enumerable: true,
  /**
   *
   * @return {number}
   */
  get() {
    return this.getHours();
  },
  /**
   *
   * @param {number} value
   */
  set(value) {
    this.setHours(value);
  }
});

Object.defineProperty(Date.prototype, 'minutes', {
  enumerable: true,
  /**
   *
   * @return {number}
   */
  get() {
    return this.getMinutes();
  },
  /**
   *
   * @param {number} value
   */
  set(value) {
    this.setMinutes(value);
  }
});

Object.defineProperty(Date.prototype, 'milliseconds', {
  enumerable: true,
  /**
   *
   * @return {number}
   */
  get() {
    return this.getMilliseconds();
  },
  /**
   *
   * @param {number} value
   */
  set(value) {
    this.setMilliseconds(value);
  }
});

Object.defineProperty(Date.prototype, 'month', {
  enumerable: true,
  /**
   *
   * @return {number}
   */
  get() {
    return this.getMonth() + 1;
  },
  /**
   *
   * @param {number} value
   * @return {void}
   */
  set(value) {
    this.setMonth(value - 1);
  }
});

Object.defineProperty(Date.prototype, 'seconds', {
  enumerable: true,
  /**
   *
   * @return {number}
   */
  get() {
    return this.getSeconds();
  },
  /**
   *
   * @param {number} value
   */
  set(value) {
    this.setSeconds(value);
  }
});

Object.defineProperty(Date.prototype, 'time', {
  enumerable: true,
  /**
   *
   * @return {number}
   */
  get() {
    return this.getTime();
  },
  /**
   *
   * @param {number} value
   */
  set(value) {
    this.setTime(value);
  }
});

Object.defineProperty(Date.prototype, 'year', {
  enumerable: true,
  /**
   *
   * @return {number}
   */
  get() {
    return this.getFullYear();
  },
  /**
   *
   * @param {number} value
   * @return {void}
   */
  set(value) {
    this.setFullYear(value);
  }
});
