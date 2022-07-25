/**
 * @typedef IResponseBody
 * @property {String[]} errors
 * @property {{client_token: String}} auth
 */
export interface IResponseBody {
  errors?: string[];

  // eslint-disable-next-line camelcase
  client_token?: string;
}