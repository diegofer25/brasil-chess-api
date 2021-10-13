import { BulkWriteOpResultObject, CollectionBulkWriteOptions, DeleteWriteOpResultObject, UpdateWriteOpResult } from "mongodb";
import { Request, RequestHandler } from "express";

export type UpdateResult = UpdateWriteOpResult["result"]
export type DeleteResult = DeleteWriteOpResultObject["result"]
export type BulkOptions = CollectionBulkWriteOptions
export interface BulkWriteResult {
  result: BulkWriteOpResultObject
}

export type ApiMethod = "get" | "post" | "put" | "patch" | "delete"

export type HandlerRequest<T = any> = (req: Request<any>) => Promise<T>

export interface ApiRoute {
  method: ApiMethod
  path: string
  middlewares?: RequestHandler[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handlerRequest: HandlerRequest
}

export enum StatusError {
  BadRequest = 400,
  Unauthorized = 401,
  NotFound = 404,
  Conflict = 409,
}

export interface ListQueryParameters {
  limit?: string
  skip?: string
  sort?: string
  search?: string
}
