import mongoose from "mongoose";

/**
 * Cached Mongoose connection for the serverless runtime.
 *
 * On Vercel every invocation may be a cold lambda; without caching we'd open a
 * new connection per request and exhaust Atlas. We stash the connection (and the
 * in-flight promise) on `globalThis` so it survives module re-evaluation.
 *
 * The whole DB layer is OPTIONAL: with no `MONGODB_URI` set, `connectDB()`
 * resolves to `null` and callers fall back to the static `src/data` content, so
 * the site runs exactly as before until a database is configured.
 */
const MONGODB_URI = process.env.MONGODB_URI;

type Cache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  // eslint-disable-next-line no-var
  var _mongooseCache: Cache | undefined;
}

const cached: Cache = globalThis._mongooseCache ?? { conn: null, promise: null };
globalThis._mongooseCache = cached;

/** True when a database is configured (a `MONGODB_URI` is present). */
export function dbConfigured(): boolean {
  return Boolean(MONGODB_URI);
}

/** Connect (once) and return the Mongoose instance, or `null` if no URI is set. */
export async function connectDB(): Promise<typeof mongoose | null> {
  if (!MONGODB_URI) return null;
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false });
  }
  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null; // let the next call retry instead of caching a failure
    throw err;
  }
  return cached.conn;
}
