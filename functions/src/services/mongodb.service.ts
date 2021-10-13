import { STATES, connect, connection, set } from "mongoose";

export function startMongodbService() {
  if (typeof process.env.MONGODB_URI === "string") {
    set("useCreateIndex", true);

    if (connection.readyState === STATES.disconnected) {
      connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    }

    if (process.env.FUNCTIONS_EMULATOR === "true") {
      process.on("exit", closeMongodbConnection);
      process.on("SIGINT", closeMongodbConnection);
      process.on("SIGUSR1", closeMongodbConnection);
      process.on("SIGUSR2", closeMongodbConnection);
    }
  } else {
    throw new Error("Mongodb URI was not informed");
  }
}

function closeMongodbConnection() {
  connection.close();
}
