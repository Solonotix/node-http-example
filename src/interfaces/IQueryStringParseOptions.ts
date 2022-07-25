import { ParseOptions } from 'querystring';

import { IQueryStringBaseOptions } from './IQueryStringBaseOptions';

export interface IQueryStringParseOptions extends IQueryStringBaseOptions {
  options?: ParseOptions;
}