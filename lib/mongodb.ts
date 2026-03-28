import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable in .env.local"
  );
}

/**
 * Cached connection interface to store the mongoose instance
 * and the pending connection promise across hot reloads in development.
 */
interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

/**
 * In development, Next.js hot-reloads the module on every change.
 * We attach the cache to the global object to prevent creating
 * multiple connections across reloads.
 */
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

/**
 * Connects to MongoDB using Mongoose.
 * Returns the cached connection if one already exists.
 */
async function connectToDatabase(): Promise<Mongoose> {
  // Return existing connection if available
  if (cached.conn) {
    return cached.conn;
  }

  // Create a new connection promise if one isn't already in progress
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false, // Disable buffering so errors surface immediately
    });
  }

  // Await and cache the resolved connection
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDatabase;
