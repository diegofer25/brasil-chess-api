import { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = function(error: Error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  const message = error.message || "an unexpected error occurred";
  const status = error.status || 500;

  if (status === 500) {
    console.error({ message: error.message, stack: error.stack });
  }

  res.status(status).send({ message, status });
};
