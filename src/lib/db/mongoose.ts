import mongoose from "mongoose";

type MongooseGlobal = typeof globalThis & {
  mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
};

const globalWithMongoose = global as MongooseGlobal;

if (!globalWithMongoose.mongoose) {
  globalWithMongoose.mongoose = { conn: null, promise: null };
}

function getMongoUri(): string {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      "MONGODB_URI is missing. Add it in Vercel → Project → Settings → Environment Variables."
    );
  }
  return uri; // ✅ TypeScript now knows this is string
}

export async function dbConnect() {
  if (globalWithMongoose.mongoose.conn) return globalWithMongoose.mongoose.conn;

  if (!globalWithMongoose.mongoose.promise) {
    const uri = getMongoUri(); // ✅ string

    globalWithMongoose.mongoose.promise = mongoose
      .connect(uri, {
        dbName: "thebootroom",
        bufferCommands: false,
      })
      .then((m) => m);
  }

  globalWithMongoose.mongoose.conn = await globalWithMongoose.mongoose.promise;
  return globalWithMongoose.mongoose.conn;
}
