import { Agent, ClientRequestArgs, OutgoingHttpHeaders } from 'http';
import { Socket } from 'net';
import { KeyObject, PxfObject, SecureVersion } from 'tls';

import { IDictionary } from '../utilities';

import { ISingleOrMultiFile } from './ISingleOrMultiFile';
import { OptionalValue } from './OptionalValue';
import { IHttpRequest } from "./IHttpRequest";

export interface IHttpOptions extends IDictionary {
  toRequest?: () => IHttpRequest;

  _defaultAgent?: OptionalValue<Agent>;

  abort?: OptionalValue<AbortSignal>;

  agent?: OptionalValue<Agent | boolean>;

  auth?: OptionalValue<string | null>;

  /**
   * Optionally override the trusted CA certificates. Default is to trust
   * the well-known CAs curated by Mozilla. Mozilla's CAs are completely
   * replaced when CAs are explicitly specified using this option.
   */
  ca?: OptionalValue<ISingleOrMultiFile>;

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
  cert?: OptionalValue<ISingleOrMultiFile>;

  /**
   * Cipher suite specification, replacing the default. For more
   * information, see modifying the default cipher suite. Permitted
   * ciphers can be obtained via tls.getCiphers(). Cipher names must be
   * uppercased in order for OpenSSL to accept them.
   */
  ciphers?: OptionalValue<string>;

  /**
   * Name of an OpenSSL engine which can provide the client certificate.
   */
  clientCertEngine?: OptionalValue<string>;

  // https://github.com/nodejs/node/blob/master/lib/_http_client.js#L278
  createConnection?: OptionalValue<(options: ClientRequestArgs, oncreate: (err: Error, socket: Socket) => void) => Socket>;

  /**
   * PEM formatted CRLs (Certificate Revocation Lists).
   */
  crl?: OptionalValue<ISingleOrMultiFile>;

  defaultPort?: OptionalValue<number | string>;

  /**
   * Diffie Hellman parameters, required for Perfect Forward Secrecy. Use
   * openssl dhparam to create the parameters. The key length must be
   * greater than or equal to 1024 bits or else an error will be thrown.
   * Although 1024 bits is permissible, use 2048 bits or larger for
   * stronger security. If omitted or invalid, the parameters are
   * silently discarded and DHE ciphers will not be available.
   */
  dhparam?: OptionalValue<string | Buffer>;

  /**
   * A string describing a named curve or a colon separated list of curve
   * NIDs or names, for example P-521:P-384:P-256, to use for ECDH key
   * agreement. Set to auto to select the curve automatically. Use
   * crypto.getCurves() to obtain a list of available curve names. On
   * recent releases, openssl ecparam -list_curves will also display the
   * name and description of each available elliptic curve. Default:
   * tls.DEFAULT_ECDH_CURVE.
   */
  ecdhCurve?: OptionalValue<string>;

  family?: OptionalValue<number>;

  headers?: OptionalValue<OutgoingHttpHeaders>;

  /**
   * Attempt to use the server's cipher suite preferences instead of the
   * client's. When true, causes SSL_OP_CIPHER_SERVER_PREFERENCE to be
   * set in secureOptions
   */
  honorCipherOrder?: OptionalValue<boolean>;

  host?: OptionalValue<string>;

  hostname?: OptionalValue<string>;

  localAddress?: OptionalValue<string>;

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
  key?: OptionalValue<string | Buffer | Array<Buffer | KeyObject>>;

  /**
   * @default 8192
   */
  maxHeaderSize?: OptionalValue<number>;

  /**
   * Optionally set the maximum TLS version to allow. One
   * of `'TLSv1.3'`, `'TLSv1.2'`, `'TLSv1.1'`, or `'TLSv1'`. Cannot be specified along with the
   * `secureProtocol` option, use one or the other.
   * **Default:** `'TLSv1.3'`, unless changed using CLI options. Using
   * `--tls-max-v1.2` sets the default to `'TLSv1.2'`. Using `--tls-max-v1.3` sets the default to
   * `'TLSv1.3'`. If multiple of the options are provided, the highest maximum is used.
   */
  maxVersion?: OptionalValue<SecureVersion>;

  method?: OptionalValue<string>;

  /**
   * Optionally set the minimum TLS version to allow. One
   * of `'TLSv1.3'`, `'TLSv1.2'`, `'TLSv1.1'`, or `'TLSv1'`. Cannot be specified along with the
   * `secureProtocol` option, use one or the other.  It is not recommended to use
   * less than TLSv1.2, but it may be required for interoperability.
   * **Default:** `'TLSv1.2'`, unless changed using CLI options. Using
   * `--tls-v1.0` sets the default to `'TLSv1'`. Using `--tls-v1.1` sets the default to
   * `'TLSv1.1'`. Using `--tls-min-v1.3` sets the default to
   * 'TLSv1.3'. If multiple of the options are provided, the lowest minimum is used.
   */
  minVersion?: OptionalValue<SecureVersion>;

  /**
   * Shared passphrase used for a single private key and/or a PFX.
   */
  passphrase?: OptionalValue<string>;

  path?: OptionalValue<string>;

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
  pfx?: OptionalValue<string | Buffer | Array<string | Buffer | PxfObject>>;

  port?: OptionalValue<number | string>;

  /**
   * Name of an OpenSSL engine to get private key from. Should be used
   * together with privateKeyIdentifier.
   */
  privateKeyEngine?: OptionalValue<string>;

  /**
   * Identifier of a private key managed by an OpenSSL engine. Should be
   * used together with privateKeyEngine. Should not be set together with
   * key, because both options define a private key in different ways.
   */
  privateKeyIdentifier?: OptionalValue<string>;

  protocol?: OptionalValue<string>;

  /**
   * @default true
   */
  rejectUnauthorized?: OptionalValue<boolean>; // Defaults to true

  /**
   * Optionally affect the OpenSSL protocol behavior, which is not
   * usually necessary. This should be used carefully if at all! Value is
   * a numeric bitmask of the SSL_OP_* options from OpenSSL Options
   */
  secureOptions?: OptionalValue<number>; // Value is a numeric bitmask of the `SSL_OP_*` options

  /**
   * Legacy mechanism to select the TLS protocol version to use, it does
   * not support independent control of the minimum and maximum version,
   * and does not support limiting the protocol to TLSv1.3. Use
   * minVersion and maxVersion instead. The possible values are listed as
   * SSL_METHODS, use the function names as strings. For example, use
   * 'TLSv1_1_method' to force TLS version 1.1, or 'TLS_method' to allow
   * any TLS protocol version up to TLSv1.3. It is not recommended to use
   * TLS versions less than 1.2, but it may be required for
   * interoperability. Default: none, see minVersion.
   */
  secureProtocol?: OptionalValue<string>;

  /**
   * Opaque identifier used by servers to ensure session state is not
   * shared between applications. Unused by clients.
   */
  sessionIdContext?: OptionalValue<string>;

  /**
   * The number of seconds after which a TLS session created by the
   * server will no longer be resumable. See Session Resumption for more
   * information. Default: 300.
   */
  sessionTimeout?: OptionalValue<number>;

  setHost?: OptionalValue<boolean>;

  /**
   *  Colon-separated list of supported signature algorithms. The list
   *  can contain digest algorithms (SHA256, MD5 etc.), public key
   *  algorithms (RSA-PSS, ECDSA etc.), combination of both (e.g
   *  'RSA+SHA384') or TLS v1.3 scheme names (e.g. rsa_pss_pss_sha512).
   */
  sigalgs?: OptionalValue<string>;

  socketPath?: OptionalValue<string>;

  timeout?: OptionalValue<number>;
}