import { IDictionary } from '../utilities';

export interface IQueryStringBaseOptions extends IDictionary {
  /**
   * Equals assignment operator in the querystring
   * @default =
   */
  eq?: string;

  /**
   * Parameter separator for the querystring
   * @default &
   */
  sep?: string;
}