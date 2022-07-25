/**
 * Function for providing an awaitable wait
 * @param {Number} time Milliseconds to wait
 * @return {Promise} Awaitable object that will timeout after time
 */
 export function sleep(time: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, time));
}
