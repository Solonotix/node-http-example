import './interfaces';

BigInt.prototype.between = function (this: bigint, a: bigint, b: bigint): boolean {
  const min = a < b ? a : b;
  const max = a < b ? b : a;
  return this >= min && this <= max;
};

BigInt.between = (val: bigint, a: bigint, b: bigint) => val.between(a, b);

BigInt.prototype.divide = function (this: bigint, divisor: bigint | number): [bigint, bigint] {
  const local = BigInt(divisor);
  return [this / local, this % local];
};

BigInt.divide = (dividend: bigint | number, divisor: bigint | number): [bigint, bigint] =>
  BigInt(dividend).divide(BigInt(divisor));
