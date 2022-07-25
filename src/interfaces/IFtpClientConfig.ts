import { Agent } from 'http';

export interface IFtpClientConfig {
  host?: string;
  port?: string | number;
  localAddress?: string;
  localPort?: string | number;
  forceIPv4?: boolean;
  forceIPv6?: boolean;
  keepaliveCountMax?: number;
  keepaliveInterval?: number;
  readyTimeout?: number;
  username?: string;
  password?: string;
  privateKey?: string | Buffer;
  tryKeyboard?: boolean;
  agent?: typeof Agent;
  allowAgentFwd?: boolean;
  authHandler?: unknown;
  hostHashAlgo?: string;
  hostHashCb?: CallableFunction;
  strictVendor?: unknown;
  debug?: boolean;
}