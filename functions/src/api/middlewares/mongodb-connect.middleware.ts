import { RequestHandler } from "express";
import { STATES, connection } from "mongoose";
import { waitConnection } from "~/utils/wait-connection";

export const mongodbConnect: RequestHandler = async function(req, res, next) {
  if (connection.readyState === STATES.connecting) {
    await waitConnection(connection);
  }
  next();
};
