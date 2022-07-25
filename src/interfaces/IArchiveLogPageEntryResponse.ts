import { NameValuePair } from '../common';

import { IArchiveLogPageEntryResponseContent } from './IArchiveLogPageEntryResponseContent';

export interface IArchiveLogPageEntryResponse {
  status: number;
  statusText: string;
  httpVersion: string;
  cookies: string[];
  headers: NameValuePair<string>[];
  _transferSize: number;
  content: IArchiveLogPageEntryResponseContent;
  redirectURL: string;
  headersSize: number;
  bodySize: number;
}
