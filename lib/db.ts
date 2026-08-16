import mongoose from "mongoose";
import { AppError } from "@/lib/errors";
import { env } from "@/lib/env";

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalForMongoose = globalThis as typeof globalThis & {
  mongooseCache?: MongooseCache;
};

const cache: MongooseCache = globalForMongoose.mongooseCache ?? {
  conn: null,
  promise: null,
};

globalForMongoose.mongooseCache = cache;

function databaseUnavailable(error: unknown): AppError {
  const name = error instanceof Error ? error.name : "";
  const message = error instanceof Error ? error.message : "";
  const atlasIp =
    name === "MongooseServerSelectionError" ||
    /whitelist|not currently allowed|could not connect to any servers/i.test(
      message,
    );
  return new AppError(
    "INTERNAL_ERROR",
    atlasIp
      ? "Database is unreachable. If you use MongoDB Atlas, add this machine's IP address to the cluster IP access list."
      : "Database is unreachable. Check MONGODB_URI and network access.",
  );
}

export async function connectMongo(): Promise<typeof mongoose> {
  if (!env.MONGODB_URI) {
    throw new AppError("INTERNAL_ERROR", "Database is not configured.");
  }

  if (cache.conn && cache.conn.connection.readyState === 1) {
    return cache.conn;
  }

  if (!cache.promise) {
    mongoose.set("strictQuery", true);
    cache.promise = mongoose
      .connect(env.MONGODB_URI, {
        bufferCommands: false,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 8000,
      })
      .catch((error: unknown) => {
        cache.promise = null;
        cache.conn = null;
        throw databaseUnavailable(error);
      });
  }

  cache.conn = await cache.promise;
  return cache.conn;
}

export async function disconnectMongo(): Promise<void> {
  if (cache.conn) {
    await cache.conn.disconnect();
    cache.conn = null;
    cache.promise = null;
  }
}
