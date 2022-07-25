import { IpcNetConnectOpts, LookupFunction, OnReadOpts, TcpNetConnectOpts } from 'net';

import { IDictionary } from '../utilities';

export interface IConnectOptions extends IDictionary, IpcNetConnectOpts, TcpNetConnectOpts {
  /**
   * If set to false, then the socket will automatically end the writable side when the readable side ends.
   * See net.createServer() and the 'end' event for details.
   * @default false
   */
  allowHalfOpen?: boolean;
  family?: number;
  /**
   * If specified, wrap around an existing socket with the given file descriptor, otherwise a new socket will be created.
   */
  fd?: number;
  /**
   * Optional dns.lookup() hints.
   */
  hints?: number;
  host?: string;
  localAddress?: string;
  localPort?: number;
  lookup?: LookupFunction;
  /**
   * If specified, incoming data is stored in a single buffer and passed to the supplied callback when data arrives on the socket.
   * Note: this will cause the streaming functionality to not provide any data, however events like 'error', 'end', and 'close' will
   * still be emitted as normal and methods like pause() and resume() will also behave as expected.
   */
  onread?: OnReadOpts;
  /**
   * Path the client should connect to. See Identifying paths for IPC connections.
   * If provided, the TCP-specific options above are ignored.
   */
  path: string;
  /**
   * Port the socket should connect to. Required for TCP connections.
   */
  port: number;
  /**
   *  Allow reads on the socket when an fd is passed, otherwise ignored.
   *  @default false
   */
  readable?: boolean;
  /**
   * An Abort signal that may be used to destroy the socket.
   */
  signal?: AbortSignal;
  timeout?: number;
  /**
   * Allow writes on the socket when an fd is passed, otherwise ignored.
   * @default false
   */
  writable?: boolean;
}