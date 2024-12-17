import { ObjectId, UpdateFilter } from "mongodb";
import { MongoClient, Db, Collection, Document } from "mongodb";
import dotenv from "dotenv";
import { MongoMemoryServer } from "mongodb-memory-server";
import schemas from "../tests/db/schemas";
import mockData from "../tests/mockData";

dotenv.config();

let client: MongoClient;
let db: Db | null = null;
let mongoServer: MongoMemoryServer;

const initDevServer = async () => {
  mongoServer = await MongoMemoryServer.create({
    instance: {
      port: 27019
    }
  });
  const uri = mongoServer.getUri();
  
  client = new MongoClient(uri);
  await client.connect();
  db = client.db("BookedIn");

  // create schemas
  await db.createCollection("user", schemas.userSchema);
  await db.createCollection("meeting", schemas.meetingSchema);
  await db.createCollection("request", schemas.requestSchema);
  await db.createCollection("poll", schemas.pollSchema);

  // insert mock data
  const data = {
    user: mockData.validUsers,
    meeting: mockData.validMeetings,
    request: mockData.validRequests,
    poll: mockData.validPolls
  }

  Object.entries(data).forEach(([collectionName, data]) => {
    const collection = db!.collection(collectionName);
    collection.insertMany(data);
  });

  console.log(`Connected to BookedIn database`);
  console.log(`MongoDB Memory Server is running on ${uri}`);
}

// Initialize MongoDB connection
export const connectToDatabase = async (): Promise<Db> => {
  if (!db) {
    if (process.env.DEV_MODE) {
      await initDevServer();
    } else {
      client = new MongoClient(process.env.MONGO_URI!);
      await client.connect();
      db = client.db();
      console.log(`Connected to BookedIn database`);
    }
  }
  return db!;
};

// Get a specific collection
export const getCollection = async <T extends Document>(collectionName: string): Promise<Collection<T>> => {
  const database = await connectToDatabase();
  return database.collection<T>(collectionName);
};

export const getDocument = async <T extends Document>(collectionName: string, id: ObjectId): Promise<T | null> => {
  const collection = await getCollection<T>(collectionName);
  const document = await collection.findOne({ _id: id } as any);
  return document as T | null;
}

export const insertDocument = async <T extends Document>(
  collectionName: string,
  document: T
): Promise<ObjectId> => {
  const collection = await getCollection<T>(collectionName);

  // if (!document._id) return null;
  const result = await collection.insertOne(document as any); // guaranteed to have _id as defined in shared/types/db

  return result.insertedId;
};

export const deleteDocument = async <T extends Document>(collectionName: string, id: ObjectId): Promise<boolean> => {
  const collection = await getCollection<T>(collectionName);
  const result = await collection.deleteOne({ _id: id } as any);
  return result.deletedCount === 1;
};

export const updateOneDocument = async <T extends Document>(collectionName: string, id: ObjectId, update: UpdateFilter<T>, arrayFilters: any = undefined) => {
  const collection = await getCollection<T>(collectionName);
  const result = await collection.updateOne({ _id: id } as any, update, arrayFilters);
  return result.modifiedCount === 1;
}

// export const updateManyDOcu


// Close the database connection (e.g., on app shutdown)
export const closeDatabaseConnection = async (): Promise<void> => {
  if (client) {
    await client.close();
    console.log("Database connection closed.");
  }
};
