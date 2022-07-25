export type IEntries<T> = [keyof T, T[keyof T]][] | IterableIterator<[keyof T, T[keyof T]]>;
