import { request as http, ClientRequest, IncomingMessage } from 'http';
import { request as https } from 'https';

import './extensions';
import { PromiseExecutor } from './common';

import { IHttpResponse, IRequestArgs } from './interfaces';
import { Request as HttpRequest } from './Request';
import { Response as HttpResponse } from './Response';

type RequestMethod = typeof http | typeof https;

export class Client {
  private redirects: Map<URL, number>;
  private request?: ClientRequest;
  private readonly requestOptions: HttpRequest;
  private response?: HttpResponse;
  private reject: PromiseExecutor;
  private resolve: PromiseExecutor;

  constructor(request: IRequestArgs) {
    this.requestOptions = new HttpRequest(request);
    this.redirects = new Map();
    this.redirects.set(this.requestOptions.url as URL, 1);
    this.reject = () => void 0;
    this.resolve = () => void 0;
  }

  private get boundPromiseHandler() {
    return this.promiseHandler.bind(this);
  }

  private get boundRequestHandler() {
    return this.requestHandler.bind(this);
  }

  private get boundRequestErrorHandler() {
    return this.requestErrorHandler.bind(this);
  }

  handleRedirect(this: Client, response: IHttpResponse): Promise<IHttpResponse> {
    const { headers } = response;
    
    if(!headers || !headers.has('location')) {
      return Promise.resolve(response);
    }

    const location = headers.get('location')!;
    const url = new URL(location);

    const redirects = this.redirects.get(url) ?? 0;
    this.redirects.set(url, redirects + 1);
    this.requestOptions.setRequestUrl(url);
    
    if(this.redirects.get(url)! < 2) {
      return Client.request(this.requestOptions as IRequestArgs, this);
    }

    return Promise.resolve(response);
  }

  get isSecure() {
    return [ 'ssh:', 'sftp:', 'https:' ].includes(this.requestOptions.protocol ?? 'http');
  }

  get promise(): Promise<IHttpResponse> {
    return new Promise(this.boundPromiseHandler) as Promise<IHttpResponse>;
  }

  private promiseHandler(resolve: PromiseExecutor, reject: PromiseExecutor): void {
    const { requestOptions: { body, hasPayload = false, ...rest } } = Object.assign(this, { resolve, reject }) as this;
    this.request = this.requestMethod(rest, this.boundRequestHandler).on('error', this.boundRequestErrorHandler);
    
    // Data payloads must be written to the request stream
    if(hasPayload) {
      this.request.write(body);
    }

    this.request.end();
  }

  static async request(options: IRequestArgs, client?: Client): Promise<IHttpResponse> {
    client = client ?? new Client(options);
    const response = await client.promise;

    if(Number.between(response.statusCode ?? 0, 300, 399)) {
      return client.handleRedirect(response);
    }

    return response;
  }

  get requestMethod(): RequestMethod {
    if(this.isSecure) {
      return https;
    }

    return http;
  }

  private requestHandler(response: IncomingMessage) {
    this.response = new HttpResponse(response, this.resolve, this.reject);
  }

  private requestErrorHandler(error?: Error) {
    if(error) {
      return this.reject(error);
    }

    return this.reject(new Error('An error occurred while handling the HTTP Response'));
  }

  toJSON() {
    return {
      request: this.requestOptions,
      response: this.response,
    }
  }

  toString() {
    return JSON.stringify(this, null, 2);
  }
}
