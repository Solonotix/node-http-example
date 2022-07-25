import { readFileSync } from 'fs';
import { Agent as HttpAgent, globalAgent as _defaultAgent, OutgoingHttpHeaders } from 'http';
import { Agent as HttpsAgent } from 'https';
import { escape as encodeURIComponent, stringify, unescape as decodeURIComponent } from 'querystring';
import { KeyObject, PxfObject, SecureVersion } from 'tls';
import { urlToHttpOptions } from 'url';

import './extensions';
import Common from './common';
import { CaselessMap, ObjectOperations } from './utilities';

import {
  Agent,
  IAgentOptions,
  IHttpRequest,
  IQueryStringParseOptions,
  IQueryStringStringifyOptions,
  IRequestArgs,
  IRequestMethod,
  ISingleOrMultiFile,
  ISingleSignOn
} from './interfaces';

const { initProperty, merge } = ObjectOperations;

export class Request implements IHttpRequest {
  private readonly options: IRequestArgs;
  hasPayload: boolean;
  
  _auth?: string | Record<string, unknown>;
  _defaultAgent?: Agent;
  abort?: AbortSignal;
  agent?: Agent | boolean;
  agentOptions?: IAgentOptions;
  body?: Buffer;
  ca?: ISingleOrMultiFile;
  cert?: ISingleOrMultiFile;
  ciphers?: string;
  clientAuth?: boolean;
  clientCertEngine?: string;
  crl?: ISingleOrMultiFile;
  defaultPort?: number | string;
  dhparam?: string | Buffer;
  ecdhCurve?: string;
  family?: number;
  headers?: OutgoingHttpHeaders;
  honorCipherOrder?: boolean;
  host?: string;
  hostname?: string;
  json?: boolean;
  key?: string | Buffer | Array<Buffer | KeyObject>;
  localAddress?: string;
  maxHeaderSize?: number;
  maxVersion?: SecureVersion;
  method?: IRequestMethod;
  minVersion?: SecureVersion;
  ntlmDomain?: string;
  passphrase?: string;
  path?: string;
  pfx?: string | Buffer | Array<string | Buffer | PxfObject>;
  port?: number | string;
  privateKeyEngine?: string;
  privateKeyIdentifier?: string;
  protocol?: string;
  qs?: Record<string, unknown>;
  qsParseOptions?: IQueryStringParseOptions;
  qsStringifyOptions?: IQueryStringStringifyOptions;
  rejectUnauthorized?: boolean;
  resolveWithFullResponse?: boolean;
  secureOptions?: number;
  secureProtocol?: string;
  servername?: string;
  sessionIdContext?: string;
  sessionTimeout?: number;
  setHost?: boolean;
  sigalgs?: string;
  simple?: boolean;
  socketPath?: string;
  sso?: ISingleSignOn;
  strictSSL?: boolean;
  ticketKeys?: Buffer;
  timeout?: number;
  url?: string | URL;
  useNtlm?: boolean;
  useQuerystring?: boolean;
  workstation?: string;
  
  constructor(options: IRequestArgs) {
    this._defaultAgent = _defaultAgent;
    this.options = options;
    this.hasPayload = false;
    this.parseUrlOptions(options)
      .parseHandlingOptions(options)
      .parseQueryStringOptions(options)
      .parseAgentOptions(options)
      .parseHeaderOptions(options)
      .parseAuthOptions(options)
      .parseSingleSignOnOptions(options)
      .parsePayloadOptions(options)
      .parseNtlmOptions(options)
      .parseRemainingOptions(options);
  }
  
  private assignHeader(key: string, value: string, overwrite?: boolean): this {
    const { headers = {} } = this;
    const { [key]: original } = headers;
    
    if (!original || overwrite) {
      return Object.assign(this, { headers });
    }
  }
  
  private assignmentValidation<T>(key: keyof Request & keyof IRequestArgs, options: IRequestArgs, validators: Record<string, unknown> = {}): this {
    const value = options[key] as T;
    if (value != null) {
      const { prototype: { constructor } = {} } = validators['cls'] ?? Object.create(null);
      
      if (!validators['cls'] || value instanceof constructor) {
        return Object.assign(this, { [key]: value });
      }
    }
    
    return this;
  }
  
  get auth(): string | undefined {
    switch (typeof this._auth) {
      case 'string':
        return this._auth;
      case 'object':
        return Buffer.from(JSON.stringify(this._auth)).toString('base64url');
      default:
        return this._auth != null ? `${this._auth}` : undefined;
    }
  }
  
  static create(options: IRequestArgs): Request {
    return (Object.assign(Object.create(Request.prototype), { _defaultAgent, options }) as Request)
      .parseUrlOptions(options)
      .parseHandlingOptions(options)
      .parseQueryStringOptions(options)
      .parseAgentOptions(options)
      .parseHeaderOptions(options)
      .parseAuthOptions(options)
      .parseSingleSignOnOptions(options)
      .parsePayloadOptions(options)
      .parseNtlmOptions(options)
      .parseRemainingOptions(options);
  }
  
  private parseAgentOptions(options: IRequestArgs): Request {
    const { agent, agentOptions = {}, clientAuth } = options;
    if (clientAuth === false) {
      return this;
    }
    
    const {
      ca: caDefault                 = readFileSync(Common.caLocation!, 'utf-8'),
      cert: certDefault             = Common.pemLocation ? readFileSync(Common.pemLocation, 'utf-8') : '',
      key: keyDefault               = Common.keyLocation ? readFileSync(Common.keyLocation, 'utf-8') : '',
      passphrase: passphraseDefault = readFileSync(Common.pwdLocation!, 'utf-8'),
      pfx: pfxDefault               = Common.pfxLocation ? readFileSync(Common.pfxLocation) : undefined
    } = agentOptions;
    
    const {
      ca         = caDefault,
      cert       = certDefault,
      key        = keyDefault,
      passphrase = passphraseDefault,
      pfx        = pfxDefault
    } = options;
    
    const sslProps = pfx ? { ca, pfx, passphrase } : { ca, cert, key, passphrase };
    
    if (agent instanceof HttpAgent) {
      this.agent = agent;
    }
    else if ((pfx || cert && key) && ca && passphrase) {
      this.agent = new HttpsAgent(sslProps);
    }
    
    return Object.assign(this, { agentOptions, ...sslProps });
  }
  
  private parseAuthOptions(options: IRequestArgs): Request {
    const { auth } = options;
    if (typeof auth === 'string') {
      const encoded = /^(.+):(.+)$/.test(auth) ? Buffer.from(auth).toString('base64') : auth;
      this.assignHeader('Authorization', `Basic ${encoded}`, true);
      return Object.assign(this, { auth });
    }
    else if (typeof auth !== 'object') {
      return this;
    }
    
    const {
      // JSON Web Token authorization
      jwt: {
        token: jsonWebToken = ''
      }        = {},
      // OAuth Bearer Token authorization
      oauth: {
        token: bearerToken = ''
      }        = {},
      // Basic Auth
      password = '',
      username = ''
    } = auth;
    
    // If a Bearer token was provided, either in OAuth or JWT format
    if (bearerToken || jsonWebToken) {
      this.assignHeader('Authorization', `Bearer ${bearerToken || jsonWebToken}`);
    }
    // If basic auth values were passed
    else if (username && password) {
      const encoded = Buffer.from(`${username}:${password}`).toString('base64');
      this.assignHeader('Authorization', `Basic ${encoded}`);
    }
    
    return this;
  }
  
  private parseHandlingOptions(options: IRequestArgs): Request {
    const { resolveWithFullResponse = true, simple = false, strictSSL = false, useQuerystring = false } = options;
    const { rejectUnauthorized = !resolveWithFullResponse } = options;
    return Object.assign(this, { rejectUnauthorized, resolveWithFullResponse, simple, strictSSL, useQuerystring });
  }
  
  private parseHeaderOptions(options: IRequestArgs): Request {
    const { headers = {} } = options;
    initProperty(headers, 'Connection', 'close');
    return Object.assign(this, { headers });
  }
  
  private parseNtlmOptions(options: IRequestArgs): Request {
    const { json = false, ntlmDomain, useNtlm = false, workstation } = options;
    
    if (!useNtlm) {
      return this;
    }
    
    return Object.assign(this, { json, ntlmDomain, useNtlm, workstation });
  }
  
  private parsePayloadOptions(options: IRequestArgs): Request {
    const { body: raw = '' } = options;
    const body = this.payloadDataToBuffer(raw);
    
    if (!body) {
      return this;
    }
    
    this.hasPayload = true;
    return Object.assign(this, { body });
  }
  
  private parseQueryStringOptions(options: IRequestArgs): Request {
    const { url } = this;
    const { qs = {}, qsParseOptions = {}, qsStringifyOptions = {}, useQuerystring = false } = options;
    
    if (!useQuerystring) {
      return this;
    }
    
    merge({ eq: '=', sep: '&', maxKeys: 1000, decodeURIComponent }, qsParseOptions);
    const { eq, sep } = merge({ eq: '=', sep: '&', encodeURIComponent }, qsStringifyOptions) as IQueryStringStringifyOptions;
    
    const { pathname, searchParams } = url as URL;
    
    for (const [ key, value ] of
      (
        new Map(Object.entries(qs))
      )) {
      searchParams.append(key, typeof value === 'object' ? JSON.stringify(value) : `${value}`);
    }
    
    const params = stringify(Object.fromEntries(new Map(searchParams).entries()), sep, eq, qsStringifyOptions.options);
    const path = `${pathname}/${params}`;
    
    return Object.assign(this, { path, qs, qsParseOptions, qsStringifyOptions, useQuerystring });
  }
  
  private parseRemainingOptions(options: IRequestArgs): Request {
    this.assignmentValidation<AbortSignal>('abort', options, { cls: AbortSignal });
    this.assignmentValidation<string>('ciphers', options);
    this.assignmentValidation<string>('clientCertEngine', options);
    this.assignmentValidation<ISingleOrMultiFile>('crl', options);
    this.assignmentValidation<string | Buffer>('dhparam', options);
    this.assignmentValidation<string>('ecdhCurve', options);
    this.assignmentValidation<number>('family', options);
    this.assignmentValidation<boolean>('honorCipherOrder', options);
    this.assignmentValidation<number>('maxHeaderSize', options);
    this.assignmentValidation<SecureVersion>('maxVersion', options);
    this.assignmentValidation<IRequestMethod>('method', options);
    this.assignmentValidation<SecureVersion>('minVersion', options);
    this.assignmentValidation<string>('privateKeyEngine', options);
    this.assignmentValidation<string>('privateKeyIdentifier', options);
    this.assignmentValidation<number>('secureOptions', options);
    this.assignmentValidation<string>('secureProtocol', options);
    this.assignmentValidation<string>('servername', options);
    this.assignmentValidation<string>('sessionIdContext', options);
    this.assignmentValidation<number>('sessionTimeout', options);
    this.assignmentValidation<boolean>('setHost', options);
    this.assignmentValidation<string>('sigalgs', options);
    this.assignmentValidation<string>('socketPath', options);
    this.assignmentValidation<Buffer>('ticketKeys', options);
    this.assignmentValidation<number>('timeout', options);
    
    return this;
  }
  
  private parseSingleSignOnOptions(options: IRequestArgs): Request {
    const { headers = {} } = this;
    const { Cookie: original = '' } = headers;
    const { sso = {} } = options;
    const { ssoToken = '', xsrfToken = '' } = sso;
    
    if (!(
      ssoToken || xsrfToken
    )) {
      return this;
    }
    
    const Cookie = [
      ssoToken ? `iPlanetDirectoryPro=${ssoToken}` : '',
      xsrfToken ? `XSRF-TOKEN=${xsrfToken}` : '',
      original
    ].filter(x => x).join('; ');
    this.assignHeader('Cookie', Cookie, true);
    return Object.assign(this, Object.assign(headers, { sso }));
  }
  
  private parseUrlOptions(options: IRequestArgs): Request {
    const { host, hostname, path = '/', port = '80', protocol = 'https:', uri, url } = options;
    
    switch (true) {
      case uri instanceof URL:
        return this.setRequestUrl(uri as URL);
      case url instanceof URL:
        return this.setRequestUrl(url as URL);
      case typeof uri === 'string':
        return this.setRequestUrl(new URL(uri as string));
      case typeof url === 'string':
        return this.setRequestUrl(new URL(url as string));
      case !!(
        host && hostname && path && port && protocol
      ):
        return this.setRequestUrl(new URL(`${protocol}://${host}${path}`));
      default:
        throw new TypeError('Invalid URL');
    }
  }
  
  private payloadAsJson(raw: object | string): Buffer {
    let buffer: Buffer = Buffer.alloc(0);
    
    if (typeof raw === 'object' && Object.keys(raw).length > 0) {
      buffer = Buffer.from(JSON.stringify(raw));
    }
    else if (typeof raw === 'string' && raw.isJson) {
      buffer = Buffer.from(raw);
    }
    
    this.assignHeader('Content-Type', 'application/json')
      .assignHeader('Content-Length', Buffer.byteLength(buffer).toString(), true);
    return buffer;
  }
  
  private payloadAsString(raw: string): string {
    this.assignHeader('Content-Type', 'text/plain')
      .assignHeader('Content-Length', Buffer.byteLength(raw).toString(), true);
    return raw;
  }
  
  private payloadAsUrlEncoded(raw: Record<string, any> | string): string {
    let payload = '';
    const { qsStringifyOptions = {} } = this;
    
    if (typeof raw === 'object') {
      const { eq = '=', sep = '&', options } = qsStringifyOptions!;
      payload = stringify(raw, sep, eq, options);
    }
    else if (raw) {
      payload = encodeURIComponent(raw);
    }
    
    this.assignHeader('Content-Type', 'application/x-www-form-urlencoded', true)
      .assignHeader('Content-Length', Buffer.byteLength(payload).toString(), true);
    return payload;
  }
  
  private payloadDataToBuffer(raw: object | string): Buffer | string {
    const contentType = CaselessMap.fromObject<string>(this.headers as Record<string, string>).get('content-type');
    
    if (!raw || typeof raw === 'object' && Object.keys(raw).length === 0) {
      return '';
    }
    else if (typeof raw === 'string') {
      return this.payloadAsString(raw);
    }
    
    switch (contentType?.toLowerCase()) {
      case 'application/x-www-form-urlencoded':
        return this.payloadAsUrlEncoded(raw);
      case 'application/json':
      default:
        return this.payloadAsJson(raw);
    }
  }
  
  setRequestUrl(url: URL): Request {
    return Object.assign(this, { ...urlToHttpOptions(url), url });
  }
  
  toJSON(): Record<string, unknown> {
    return {
      ...this.options,
      body: this.body,
      ca: !!this.ca,
      cert: !!this.cert,
      headers: this.headers,
      key: !!this.key,
      method: this.method,
      passphrase: !!this.passphrase,
      pfx: !!this.pfx,
      rejectUnauthorized: this.rejectUnauthorized,
      resolveWithFullResponse: this.resolveWithFullResponse,
      simple: this.simple,
      url: this.url,
      useNtlm: this.useNtlm
    };
  }
  
  toString(): string {
    return JSON.stringify(this, null, 2);
  }
}