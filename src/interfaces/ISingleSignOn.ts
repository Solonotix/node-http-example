import { IDictionary } from '../utilities';

export interface ISingleSignOn extends IDictionary {
  xsrfToken?: string;
  ssoToken?: string;
}