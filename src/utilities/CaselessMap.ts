import { IMapEntry } from './interfaces';

type MapCallback<T> = (value: T, key: string, map: Map<string, T>) => void;

export class CaselessMap<T> extends Map<string, T | IMapEntry<T>> {
  private original: [string, T][];
  private readonly silent: boolean;

  constructor(entries: [string, T][] = [], silent = false) {
    super();
    this.silent = silent;

    const original = [];

    for (const [key, value] of entries) {
      if (this.has(key)) {
        const { index } = super.get(key.toLowerCase()) as IMapEntry<T>;

        original[index] = [key, value];
        super.set(key.toLowerCase(), { value, index });
      }
      else {
        const index = original.push([key, value]) - 1;
        super.set(key.toLowerCase(), { value, index });
      }
    }

    this.original = original as [string, T][];
    Object.defineProperty(this, 'original', {
      value: original as [string, T][],
      enumerable: false
    });

    }

  [Symbol.iterator]() {
    return this.original[Symbol.iterator]();
  }

  override clear() {
    this.original = [];
    super.clear();
  }

  override delete(key: string) {
    if (this.has(key)) {
      const { index } = super.get(key.toLowerCase()) as IMapEntry<T>;
      
      for (let i = index + 1; i < this.original.length; i++) {
        const [_key, value] = this.original[i];
        super.set(_key.toLowerCase(), { value, index: i - 1 });
      }

      this.original = this.original.filter((_value, _index) => index !== _index);
    }

    return super.delete(key.toLowerCase());
  }

  override entries() {
    return this.original[Symbol.iterator]();
  }

  override forEach(callback: MapCallback<T>, thisArg?: Map<string, T>): void {
    const self = thisArg ?? this;
    for (const [key, value] of self.entries()) {
      callback(value, key, self as Map<string, T>);
    }
  }

  static fromObject<V>(obj: Record<string, V>): CaselessMap<V> {
    return new CaselessMap<V>(Object.entries(obj));
  }

  override get(key: string, def?: T): T | undefined {
    if(def !== undefined && !this.has(key)) {
      return def;
    }

    const { value } = super.get(key.toLowerCase()) || {};
    return value;
  }

  override has(key: string): boolean {
    return super.has(key.toLowerCase());
  }

  override *keys() {
    for(const [ key ] of this.entries()) {
      yield key;
    }
  }

  get length(): number {
    return this.original.length;
  }

  override set<V extends T>(key: string, value: V) {
    const index = this.has(key) ? (super.get(key.toLowerCase()) as IMapEntry<V>).index : this.original.length;

    if (index < this.original.length) {
      this.original[index] = [key, value];
    }
    else {
      this.original.push([key, value]);
    }

    super.set(key.toLowerCase(), { value, index });
    return this;
  }

  toArray() {
    return this.original;
  }

  toJSON() {
    return this.original.reduce((obj, [key, value]) => Object.assign(obj, { [key]: value }), {});
  }

  override *values() {
    for(const [ , value ] of this.entries()) {
      yield value;
    }
  }
}
