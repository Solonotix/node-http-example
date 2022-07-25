export interface IAggregateException extends Error {
  /**
   * Adds errors to the end of the stack
   */
  append(err: Error): IAggregateException;
  /**
   * Add a series of errors to the end of the stack
   */
  extend(errors: Error[] | IAggregateException): IAggregateException;
  isError: boolean;
  length: number;
  message: string;
  mirror(error: Error): IAggregateException;
  stack: string;
}