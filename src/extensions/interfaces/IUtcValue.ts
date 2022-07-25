export interface IUtcValue {
  get date(): number;

  set date(value: number);

  get fullYear(): number;

  set fullYear(value: number);

  get hours(): number;

  set hours(value: number);

  get milliseconds(): number;

  set milliseconds(value: number);

  get minutes(): number;

  set minutes(value: number);

  get month(): number;

  set month(value: number);

  get seconds(): number;

  set seconds(value: number);

  get year(): number;

  set year(value: number);
}
