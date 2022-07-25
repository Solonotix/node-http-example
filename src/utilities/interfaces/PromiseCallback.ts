export type PromiseCallback<T, TResult = unknown> = (arg: T) => TResult | PromiseLike<TResult>;
