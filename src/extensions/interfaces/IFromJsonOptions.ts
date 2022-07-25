type JsonReplacerCallback = (this: any, key: string, value: any) => any;

export interface IFromJsonOptions {
  replacer?: JsonReplacerCallback;
  space?: number | string;
}
