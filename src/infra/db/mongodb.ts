// src/infra/db/mongodb.ts

import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("Invalid/Missing environment variable: 'MONGODB_URI'");
}

const uri = process.env.MONGODB_URI;
const options = {};
const AppDatabaseName = "ILPeak_App";

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  // Allow global `var` declarations
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it"s best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export const connectAppDatabase = async () => {
  const client = await clientPromise;

  return client.db(AppDatabaseName);
}

export default clientPromise;
