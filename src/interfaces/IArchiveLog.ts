import { IArchiveLogCreator } from './IArchiveLogCreator';
import { IArchiveLogPage } from './IArchiveLogPage';
import { IArchiveLogPageEntry } from './IArchiveLogPageEntry';

export interface IArchiveLog {
  creator: IArchiveLogCreator;
  entries: IArchiveLogPageEntry[];
  pages: IArchiveLogPage[];
  version: string;
}