import { IJsonParseReviver } from './IJsonParseReviver';

export interface IJsonParseArgs {
  text: string;
  reviver?: IJsonParseReviver;
}
