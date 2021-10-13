import { BulkOptions, StatusError } from "~/types/api.types";
import { BulkWriteOperation, ProjectionOperators } from "mongodb";
import { Document, FilterQuery, Model, QueryOptions, Types, UpdateQuery } from "mongoose";

type Projection<T> = Partial<Record<keyof T, boolean>> & {
  score?: ProjectionOperators
}
interface ListQueryOptions<T> extends Omit<QueryOptions, "sort"> {
  sort?: Partial<Record<keyof T, number>> & {
    score?: ProjectionOperators
  }
}

// eslint-disable-next-line no-undef
export { FilterQuery, Projection, ListQueryOptions, BulkWriteOperation };

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function crud<T extends Document>(Schema: Model<T>) {
  async function create<R>(raw: R, query: FilterQuery<T>): Promise<T> {
    const exists = await Schema.exists(query);

    if (exists) {
      const key = Object.keys(query)[0];
      const error = new Error(`${key} already exists`);

      error.status = StatusError.Conflict;

      throw error;
    }

    return Schema.create(raw).catch((e) => {
      if (e.message.includes("validation failed")) {
        e.status = StatusError.BadRequest;
      }

      throw e;
    });
  }

  async function read(id: string, projection?: Projection<T>): Promise<T>
  async function read(query: FilterQuery<T>, projection?: Projection<T>): Promise<T>
  async function read(param: string | FilterQuery<T>, projection?: Projection<T>): Promise<T> {
    let document: T | null;

    if (typeof param === "string") {
      if (!Types.ObjectId.isValid(param)) {
        const error = new Error("invalid id");

        error.status = StatusError.BadRequest;

        throw error;
      }
      document = await Schema.findById(param, projection);
    } else {
      document = await Schema.findOne(param, projection);
    }

    if (!document) {
      const error = new Error("document not found");

      error.status = StatusError.NotFound;

      throw error;
    }

    return document;
  }

  async function readList(query: FilterQuery<T> = {}, projection?: Projection<T>, options?: ListQueryOptions<T>) {
    if (query.$text && query.$text.$search.length <= 3) {
      const error = new Error("Text search should have at last 4 characters");

      error.status = StatusError.BadRequest;

      throw error;
    }

    return Schema.find(query, projection, options);
  }

  async function update(filter: FilterQuery<T>, query: UpdateQuery<T>, options?: QueryOptions) {
    return await Schema.updateOne(filter, query, options);
  }

  async function del(filter: FilterQuery<T>, options?: QueryOptions) {
    return await Schema.deleteOne(filter, options);
  }

  async function bulkWrite<R>(operations: BulkWriteOperation<R>[], options?: BulkOptions) {
    return Schema.bulkWrite(operations, options);
  }


  return { create, read, readList, update, del, bulkWrite };
}
