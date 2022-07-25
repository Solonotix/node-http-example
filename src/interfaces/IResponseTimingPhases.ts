export interface IResponseTimingPhases {
  dns: number;
  download: number;
  firstByte: number;
  tcp: number;
  wait: number;
}