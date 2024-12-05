import { ObjectId } from "mongodb";
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
    client = new MongoClient(process.env.MONGO_URI!);
    await client.connect();
    db = client.db();
    console.log(`Connected to BookedIn database`);
  }
  return db;
};

// Get a specific collection
export const getCollection = async <T extends Document>(collectionName: string): Promise<Collection<T>> => {
  const database = await connectToDatabase();
  return database.collection<T>(collectionName);
};

export const getDocument = async <T extends Document>(collectionName: string, id: string): Promise<T | null> => {
  const collection = await getCollection<T>(collectionName);
  const document = await collection.findOne({ _id: new ObjectId(id) } as any);
  return document as T | null;
};

// Close the database connection (e.g., on app shutdown)
export const closeDatabaseConnection = async (): Promise<void> => {
  if (client) {
    await client.close();
    console.log("Database connection closed.");
  }
};
