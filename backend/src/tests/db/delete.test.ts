// Jiaju Nie
import {
  describe,
  test,
  expect,
  afterEach,
  beforeAll,
  afterAll,
} from "@jest/globals";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Db, MongoClient } from "mongodb";
import mockData from "../mockData";
import schemas from "./schemas";

describe("Deleting data from different collections", () => {
  let mongoServer: MongoMemoryServer;
  let connection: MongoClient;
  let db: Db;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    connection = await MongoClient.connect(uri);
    db = connection.db("BookedIn");

    await db.createCollection("user", schemas.userSchema);
    await db.createCollection("meeting", schemas.meetingSchema);
    await db.createCollection("request", schemas.requestSchema);
    await db.createCollection("poll", schemas.pollSchema);
  });

  afterAll(async () => {
    expect(connection).toBeDefined();
    expect(mongoServer).toBeDefined();
    await connection.close();
    await mongoServer.stop();
  });

  //Clear all data between tests
  afterEach(async () => {
    if (db) {
      const collections = await db.collections();
      for (const collection of collections) {
        await collection.deleteMany({});
      }
    }
  });

  const testSets = {
    user: {
      valid: mockData.validUsers
    },
    meeting: {
      valid: mockData.validMeetings
    },
    poll: {
      valid: mockData.validPolls
    },
    request: {
      valid: mockData.validRequests
    }
  };

  Object.entries(testSets).forEach(([collectionName, data]) => {
    describe(`delete ${collectionName}`, () => {
      
      test(`should successfully delete ${data.valid.length} documents`, async () => {
        const collection = db.collection(collectionName);
        
        const insertResult = await collection.insertMany(data.valid);
        expect(insertResult.insertedCount).toBe(data.valid.length);

        const countBefore = await collection.countDocuments();
        expect(countBefore).toBe(data.valid.length);

        const deleteResult = await collection.deleteMany({});
        expect(deleteResult.deletedCount).toBe(data.valid.length);

        const countAfter = await collection.countDocuments();
        expect(countAfter).toBe(0);
      });

      test(`should successfully delete last document`, async () => {
        const collection = db.collection(collectionName);
        
        const insertResult = await collection.insertMany(data.valid);
        expect(insertResult.insertedCount).toBe(data.valid.length);

        const lastDoc = data.valid[data.valid.length - 1];
        const deleteResult = await collection.deleteOne({ _id: lastDoc._id });
        expect(deleteResult.deletedCount).toBe(1);

        const deletedDoc = await collection.findOne({ _id: lastDoc._id });
        expect(deletedDoc).toBeNull();

        const remainingCount = await collection.countDocuments();
        expect(remainingCount).toBe(data.valid.length - 1);
      });
    });
  });
});
