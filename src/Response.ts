import { IncomingMessage } from 'http';

import './extensions';
import { PromiseExecutor } from './common';
import { CaselessMap, ObjectOperations } from './utilities';

import { IHttpResponse } from './interfaces';

const { kvsToObject } = ObjectOperations;

export class Response implements IHttpResponse {
  private _headers?: CaselessMap<string>;
  private _trailers?: CaselessMap<string>;
  private data: Buffer[];
  private raw: IncomingMessage;
  private readonly rawHeaders: string[];
  private readonly rawTrailers: string[];
  private readonly resolve: PromiseExecutor;
  private readonly reject: PromiseExecutor;

  method: string;
  statusCode: number;
  statusMessage: string;

  constructor(response: IncomingMessage, resolve: PromiseExecutor, reject: PromiseExecutor) {
    this.data = [];
    this.reject = reject;
    this.resolve = resolve;
    this.raw = response;
    const { method, rawHeaders, rawTrailers, statusCode, statusMessage } = response;
    this.method = method ?? 'GET';
    this.rawHeaders = rawHeaders;
    this.rawTrailers = rawTrailers;
    this.statusCode = statusCode ?? 200;
    this.statusMessage = statusMessage ?? 'OK';

    this.raw.on('data', this.boundDataHandler);
    this.raw.on('end', this.boundEndHandler);
    this.raw.on('error', this.boundErrorHandler);

    }

  get body() {
    try {
      const string = `${Buffer.concat(this.data)}`;

      try {
        return JSON.parse(string);
      }
      catch {
        return string;
      }
    }
    catch {
      return this.data.join('');
    }
  }

  private get boundDataHandler() {
    return this.responseDataHandler.bind(this);
  }

  private get boundEndHandler() {
    return this.responseEndHandler.bind(this);
  }

  private get boundErrorHandler() {
    return this.responseErrorHandler.bind(this);
  }

  get headers(): CaselessMap<string> {
    if(!this._headers) {
      this._headers = CaselessMap.fromObject(kvsToObject(this.rawHeaders));
    }

    return this._headers;
  }

  private responseDataHandler(chunk: Buffer) {
    this.data.push(chunk);
  }

  private responseEndHandler() {
    this.resolve(this);
  }

  private responseErrorHandler(error?: Error) {
    if(error) {
      return this.reject(error);
    }

    return this.reject(new Error('An error occurred while handling the HTTP Response'));
  }

  get status(): number {
    return this.statusCode;
  }

  get statusText(): string {
    return this.statusMessage;
  }

  toJSON() {
    return {
      body: this.body,
      headers: this.headers,
      method: this.method,
      statusCode: this.statusCode,
      statusMessage: this.statusMessage,
      trailers: this.trailers
    };
  }

  toString() {
    return JSON.stringify(this, null, 2);
  }

  get trailers(): CaselessMap<string> {
    if(!this._trailers) {
      this._trailers = CaselessMap.fromObject(kvsToObject(this.rawTrailers));
    }

    return this._trailers;
  }
}
