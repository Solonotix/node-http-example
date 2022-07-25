import { NameValuePair } from '../common';

import { IArchiveLogPageEntryRequestPostData } from './IArchiveLogPageEntryRequestPostData';

export interface IArchiveLogPageEntryRequest {
  bodySize?: number;
  cookies?: NameValuePair<string>[];
  headers?: NameValuePair<string>[];
  headersSize?: number;
  httpVersion?: string;
  method?: string;
  postData?: IArchiveLogPageEntryRequestPostData;
  querystring?: string[];
  url?: string;
}
