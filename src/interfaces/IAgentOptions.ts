import { AgentOptions } from 'https';
import { KeyObject, PxfObject } from "tls";

import { IDictionary } from '../utilities';

declare type AgentScheduling = 'fifo' | 'lifo'; 

export interface IAgentOptions extends IDictionary, AgentOptions {
  /**
   * Optionally override the trusted CA certificates. Default is to trust
   * the well-known CAs curated by Mozilla. Mozilla's CAs are completely
   * replaced when CAs are explicitly specified using this option.
   */
  ca?: string | Buffer | Array<string | Buffer>;
  /**
   *  Cert chains in PEM format. One cert chain should be provided per
   *  private key. Each cert chain should consist of the PEM formatted
   *  certificate for a provided private key, followed by the PEM
   *  formatted intermediate certificates (if any), in order, and not
   *  including the root CA (the root CA must be pre-known to the peer,
   *  see ca). When providing multiple cert chains, they do not have to
   *  be in the same order as their private keys in key. If the
   *  intermediate certificates are not provided, the peer will not be
   *  able to validate the certificate, and the handshake will fail.
   */
  cert?: string | Buffer | Array<string | Buffer>;
  /**
   * Keep sockets around in a pool to be used by other requests in the future. Default = false
   */
  keepAlive?: boolean;
  /**
   * When using HTTP KeepAlive, how often to send TCP KeepAlive packets over sockets being kept alive. Default = 1000.
   * Only relevant if keepAlive is set to true.
   */
  keepAliveMsecs?: number;
  /**
   * Private keys in PEM format. PEM allows the option of private keys
   * being encrypted. Encrypted keys will be decrypted with
   * options.passphrase. Multiple keys using different algorithms can be
   * provided either as an array of unencrypted key strings or buffers,
   * or an array of objects in the form {pem: <string|buffer>[,
   * passphrase: <string>]}. The object form can only occur in an array.
   * object.passphrase is optional. Encrypted keys will be decrypted with
   * object.passphrase if provided, or options.passphrase if it is not.
   */
  key?: string | Buffer | Array<Buffer | KeyObject>;
  /**
   * Maximum number of sockets to allow per host. Default for Node 0.10 is 5, default for Node 0.12 is Infinity
   */
  maxSockets?: number;
  /**
   * Maximum number of sockets allowed for all hosts in total. Each request will use a new socket until the maximum is reached. Default: Infinity.
   */
  maxTotalSockets?: number;
  /**
   * Maximum number of sockets to leave open in a free state. Only relevant if keepAlive is set to true. Default = 256.
   */
  maxFreeSockets?: number;
  /**
   * Shared passphrase used for a single private key and/or a PFX.
   */
  passphrase?: string;
  /**
   * PFX or PKCS12 encoded private key and certificate chain. pfx is an
   * alternative to providing key and cert individually. PFX is usually
   * encrypted, if it is, passphrase will be used to decrypt it. Multiple
   * PFX can be provided either as an array of unencrypted PFX buffers,
   * or an array of objects in the form {buf: <string|buffer>[,
   * passphrase: <string>]}. The object form can only occur in an array.
   * object.passphrase is optional. Encrypted PFX will be decrypted with
   * object.passphrase if provided, or options.passphrase if it is not.
   */
  pfx?: string | Buffer | Array<string | Buffer | PxfObject>;
  /**
   * Should SSL be strictly enforced
   */
  rejectUnauthorized?: boolean;
  /**
   * Socket timeout in milliseconds. This will set the timeout after the socket is connected.
   */
  timeout?: number;
  /**
   * Scheduling strategy to apply when picking the next free socket to use.
   * @default `lifo`
   */
  scheduling?: AgentScheduling;
}
