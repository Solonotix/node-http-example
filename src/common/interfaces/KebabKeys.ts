import { Kebab } from './Kebab';

// Source from StackOverflow https://stackoverflow.com/a/66140779/4271973
export type KebabKeys<T> = { [K in keyof T as K extends string ? Kebab<K> : K]: T[K] };