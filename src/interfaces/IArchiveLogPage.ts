import { IArchiveLogPageEntry } from './IArchiveLogPageEntry';

export interface IArchiveLogPage {
  entries: IArchiveLogPageEntry[];
  id: string;
  pageTimings: Record<string, number>;
  startedDateTime: string;
  title: string;
}