import { IAggregateException } from '../errors';

import { IHttpResponse } from './IHttpResponse';

export interface ISafeResponse {
  response?: IHttpResponse;
  error?: IAggregateException;
}
