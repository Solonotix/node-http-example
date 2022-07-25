import { IDictionary } from '../utilities';

export interface IHttpResponse extends IDictionary {
  body?: string | Record<string, any> | Record<string, any>[];
  headers?: Map<string, string>;
  status?: number;
  statusCode?: number;
  statusText?: string;
  statusMessage?: string;
}
