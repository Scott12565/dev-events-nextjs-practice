import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable in .env.local'
  );
}

// Narrowed to string after the guard above
const uri: string = MONGODB_URI;

/**
 * Shape of the cached Mongoose connection stored on the global object.
 * - `conn`    – the resolved Mongoose instance once connected
 * - `promise` – the in-flight connection promise (prevents duplicate calls)
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

/**
 * Extend the Node.js global type so TypeScript knows about our cache.
 * Using `var` here is intentional – it is required for global augmentation.
 */
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

/**
 * In development, Next.js clears the module cache on every hot-reload,
 * which would create a new Mongoose connection on each reload. Persisting
 * the cache on `global` survives those reloads so only one connection is
 * kept alive at a time.
 */
const cached: MongooseCache = global.mongoose ?? { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

/**
 * Connect to MongoDB and return the Mongoose instance.
 * Subsequent calls return the cached connection without re-connecting.
 */
export async function connectDB(): Promise<typeof mongoose> {
  // Re-use an existing, open connection
  if (cached.conn) {
    return cached.conn;
  }

  // Start a new connection only if one isn't already in progress
  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, {
      // Buffers commands until the connection is established instead of
      // throwing immediately, which is safer in serverless environments.
      bufferCommands: true,
    });
  }

  // Await the connection, cache it, then return it
  cached.conn = await cached.promise;
  return cached.conn;
}
