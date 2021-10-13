import { Connection, STATES } from "mongoose";

const TIMEOUT = 10000;
const RETRY_TIME = 100;

export function waitConnection(connection: Connection): Promise<true> {
  let waitingTime = RETRY_TIME;

  return new Promise((resolve, reject) => {
    const intervalId = setInterval(async () => {
      if (connection.readyState === STATES.connected) {
        clearInterval(intervalId);
        resolve(true);
      } else if (waitingTime >= TIMEOUT) {
        clearInterval(intervalId);
        reject(new Error("there is something wrong with mongodb connection"));
      } else {
        waitingTime += RETRY_TIME;
      }
    }, RETRY_TIME);
  });
}
