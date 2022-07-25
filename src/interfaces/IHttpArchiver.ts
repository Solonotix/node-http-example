import { NameValuePair } from '../common';

import { IArchiveLogPageEntry } from './IArchiveLogPageEntry';
import { IArchiveLogPageEntryRequest } from './IArchiveLogPageEntryRequest';
import { IHeaders } from './IHeaders';
import { IHttpRequest } from './IHttpRequest';
import { IHttpResponse } from './IHttpResponse';
import { IResponseTimingPhases } from './IResponseTimingPhases';

export interface IHttpArchiver {
  /* Constructor */
  entries: IArchiveLogPageEntry[];

  /* Methods */
  buildPostData(request: IHttpRequest): IArchiveLogPageEntryRequest;

  buildHarEntry(response: IHttpResponse): IArchiveLogPageEntry;

  buildHarEntryRequest(request: IHttpRequest, httpVersion?: string): IArchiveLogPageEntry;

  buildHarEntryResponse(response: IHttpResponse): IArchiveLogPageEntry;

  buildHarEntryTime(response: IHttpResponse, request: IHttpRequest): IArchiveLogPageEntry;

  buildHarHeaders(headers: IHeaders): NameValuePair<string>[];

  buildHarTimingPhases(timingPhases: IResponseTimingPhases): IArchiveLogPageEntry;

  buildHarTimingNoPhase(response: IHttpResponse, startTime: number, endTime: number): IArchiveLogPageEntry;

  buildHarTimings(response: IHttpResponse, request: IHttpRequest): IArchiveLogPageEntry;

  clear(): void;

  responseToHar(response: IHttpResponse): IHttpResponse;

  saveHar(fileName: string): void;
}
