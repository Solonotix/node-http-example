import { IAggregateException } from './interfaces';

export class AggregateException extends Error implements IAggregateException {
  private inner: Error[];
  isError: boolean;
  override stack: string;

  constructor(msg: string) {
    super(msg);
    // Hack to get TypeScript to ignore usage before initialization, because init occurs in super-constructor
    const { stack = '' } = this;

    this.inner = [];
    this.isError = false;
    this.stack = stack.split('\n').slice(0, 2).join('\n');
  }

  get length(): number {
    return this.inner.length;
  }

  /**
   * Adds errors to the end of the stack
   * @param {Error} err Additional error to report
   */
  append(err: Error): IAggregateException {
    this.isError = true;
    this.inner.push(err);
    this.stack = [this.stack, err.stack].join('\n');
    return this;
  }

  /**
   * Add a series of errors to the end of the stack
   */
  extend(errors: IAggregateException | Error[]): IAggregateException {
    if (errors instanceof AggregateException) {
      errors = errors.inner;
    }

    for (const error of errors as Error[]) {
      this.append(error);
    }

    return this;
  }

  mirror(error: Error): IAggregateException {
    if (!(error instanceof AggregateException)) {
      return this.append(error);
    }

    this.isError = error.isError;
    this.message = error.message;
    this.inner = error.inner;
    this.stack = error.stack;
    return this;
  }
}
