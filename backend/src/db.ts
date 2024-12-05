import { MongoClient, Db, Collection, Document } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = "mongodb://localhost:27017/Bookedin";
const DATABASE_NAME = "Bookedin";

let client: MongoClient;
let db: Db | null = null;

// Initialize MongoDB connection
export const connectToDatabase = async (): Promise<Db> => {
  if (!db) {
    client = new MongoClient(MONGO_URI);
    await client.connect();
    db = client.db(DATABASE_NAME);
    console.log(`Connected to database: ${DATABASE_NAME}`);
  }
  return db;
};

// Get a specific collection
export const getCollection = async <T extends Document>(collectionName: string): Promise<Collection<T>> => {
  const database = await connectToDatabase();
  return database.collection<T>(collectionName);
};

// Close the database connection (e.g., on app shutdown)
export const closeDatabaseConnection = async (): Promise<void> => {
  if (client) {
    await client.close();
    console.log("Database connection closed.");
  }
};
