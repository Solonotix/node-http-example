import { IArchiveLogPageEntryRequest } from './IArchiveLogPageEntryRequest';
import { IArchiveLogPageEntryResponse } from './IArchiveLogPageEntryResponse';
import { IArchiveLogPageEntryTiming } from './IArchiveLogPageEntryTiming';


export interface IArchiveLogPageEntry {
  cache?: Record<string, unknown>;
  request?: IArchiveLogPageEntryRequest;
  response?: IArchiveLogPageEntryResponse;
  startedDateTime?: Date;
  time?: number;
  timing?: IArchiveLogPageEntryTiming;
}