// lib/mongodb.ts
import { MongoClient, MongoClientOptions } from "mongodb";

// TypeScript interface for MongoDB connection options
interface CustomMongoClientOptions extends MongoClientOptions {
  tlsInsecure?: boolean;
}

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Please add your MongoDB URI to the .env file");
}

const options: CustomMongoClientOptions = {
  tls: true,
  tlsInsecure: false, // Enforce secure connections in production
  maxPoolSize: 10, // Limit connection pool size
  minPoolSize: 2, // Maintain minimum connections
  maxIdleTimeMS: 30000, // Close idle connections after 30 seconds
  serverSelectionTimeoutMS: 5000, // Timeout after 5s if no server available
  socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
  heartbeatFrequencyMS: 10000, // Send pings every 10 seconds
};

// Global variable for development connection caching
declare global {
  var _mongoClientPromise: Promise<MongoClient>;
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // Use global variable to preserve connection during HMR
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
    console.log("Created new MongoDB client in development mode");
  }
  clientPromise = global._mongoClientPromise;
} else {
  // Production connection
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
  console.log("Created new MongoDB client in production mode");
}

// Add error handling for the connection
clientPromise
  .then((connectedClient) => {
    console.log("Successfully connected to MongoDB");
    return connectedClient.db("admin").command({ ping: 1 });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  });

export default clientPromise;
