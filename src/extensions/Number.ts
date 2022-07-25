import './interfaces';

Number.between = function (val: number, a: number, b: number): boolean {
  const min = Math.min(a, b);
  const max = Math.max(a, b);

  return val >= min && val <= max;
};

Number.prototype.between = function (this: number, a: number, b: number): boolean {
  return Number.between(this, a, b);
};
