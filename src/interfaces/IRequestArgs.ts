import { OutgoingHttpHeaders } from "http";
import { KeyObject, PxfObject, SecureVersion } from "tls";

import { Agent } from "./Agent";
import { IAgentOptions } from "./IAgentOptions";
import { IQueryStringParseOptions } from "./IQueryStringParseOptions";
import { IQueryStringStringifyOptions } from "./IQueryStringStringifyOptions";
import { IRequestMethod } from "./IRequestMethod";
import { IRequestAuthArg } from "./IRequestAuthArg";
import { ISingleOrMultiFile } from "./ISingleOrMultiFile";
import { ISingleSignOn } from "./ISingleSignOn";

export interface IRequestArgs {
  abort?: AbortSignal;
  agent?: Agent | boolean;
  agentOptions?: IAgentOptions;
  auth?: string | IRequestAuthArg;
  body?: string | Record<string, any>;
  ca?: ISingleOrMultiFile;
  cert?: ISingleOrMultiFile;
  ciphers?: string;
  clientAuth?: boolean;
  clientCertEngine?: string;
  crl?: ISingleOrMultiFile;
  data?: string | Record<string, any>;
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
  method: IRequestMethod;
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
  uri?: string | URL;
  url?: string | URL;
  useNtlm?: boolean;
  useQuerystring?: boolean;
  workstation?: string;
}
