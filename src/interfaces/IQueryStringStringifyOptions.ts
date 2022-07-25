import { StringifyOptions } from 'querystring';

import { IQueryStringBaseOptions } from './IQueryStringBaseOptions';

export interface IQueryStringStringifyOptions extends IQueryStringBaseOptions {
  eq?: string;
  sep?: string;
  options?: StringifyOptions;
}
