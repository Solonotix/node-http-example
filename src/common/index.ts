import { FileOperations } from '../utilities';

const { firstFile, firstFileInDirectory, resolvePath } = FileOperations;

export * from './interfaces';
export default class Common {
  /**
   * Path to chain certificate file used in TLS auth
   * @type {String}
   */
  get caLocation() {
    return Common.caLocation;
  }

  /**
   * Path to chain certificate file used in TLS auth
   * @type {String}
   */
  static get caLocation() {
    return firstFile(
      process.env['SSL_PEM_TRUSTSTORE'] ?? '',
      firstFileInDirectory(process.env['SSL_PATH'] ?? '', /\.(pem|cert)/i) ?? '',
      resolvePath('.', 'ssl/local.pem')
    );
  }

  /**
   * Path to private key file used in TLS auth
   * @type {String}
   */
  get keyLocation() {
    return Common.keyLocation;
  }

  /**
   * Path to private key file used in TLS auth
   * @type {String}
   */
  static get keyLocation() {
    return firstFile(
      process.env['SSL_PRIVATE_KEYFILE'] ?? '',
      firstFileInDirectory(process.env['SSL_PATH'] ?? '', /\.key$/i) ?? '',
      resolvePath('.', 'ssl/local.key')
    );
  }

  /**
   * Path to client certificate file used in TLS auth
   * @type {String}
   */
  get pemLocation() {
    return Common.pemLocation;
  }

  /**
   * Path to client certificate file used in TLS auth
   * @type {String}
   */
  static get pemLocation() {
    return firstFile(
      process.env['SSL_CLIENT_PEM'] ?? '',
      firstFileInDirectory(process.env['SSL_PATH'] ?? '', /\.(pem|cert)$/i) ?? '',
      resolvePath('.', 'ssl/local.pem')
    );
  }

  /**
   * Path to PKCS12 Keystore file used in TLS auth
   * @type {String}
   */
  get pfxLocation() {
    return Common.pfxLocation;
  }

  /**
   * Path to PKCS12 Keystore file used in TLS auth
   * @type {String}
   */
  static get pfxLocation() {
    return firstFile(
      process.env['SSL_PKCS12_KEYSTORE'] ?? '',
      firstFileInDirectory(process.env['SSL_PATH'] ?? '', /\.(p12|pfx)/i) ?? '',
      resolvePath('.', 'ssl/local.p12')
    );
  }

  /**
   * Path to passphrase file used in TLS auth
   * @type {String}
   */
  get pwdLocation() {
    return Common.pwdLocation;
  }

  /**
   * Path to passphrase file used in TLS auth
   * @type {String}
   */
  static get pwdLocation() {
    return firstFile(
      process.env['SSL_KEYSTORE_PASS_FILE'] ?? '',
      firstFileInDirectory(process.env['SSL_PATH'] ?? '', /\.(pwd|txt)/i) ?? '',
      resolvePath('.', 'ssl/local.pwd')
    );
  }
}
