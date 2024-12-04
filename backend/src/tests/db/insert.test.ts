// console.log("Hello Jest");
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

describe("Inserting data into different collections", () => {
  let mongoServer: MongoMemoryServer;
  let connection: MongoClient;
  let db: Db;

  beforeAll(async () => {
    // Create MongoDB Memory Server
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    // Create connection
    connection = await MongoClient.connect(uri);
    db = connection.db("BookedIn");
    await db.createCollection("user", schemas.userSchema);
    await db.createCollection("meeting", schemas.meetingSchema);
    await db.createCollection("request", schemas.requestSchema);
    await db.createCollection("poll", schemas.pollSchema);
  });

  afterAll(async () => {
    // Clean up
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
      valid: mockData.validUsers,
      invalid: mockData.invalidUsers,
    },
    // meeting: {
    //   valid: mockData.validMeetings,
    //   invalid: mockData.invalidMeetings,
    // },
    poll: {
      valid: mockData.validPolls,
      invalid: mockData.invalidPolls
    },
    request: {
      valid: mockData.validRequests,
      invalid: mockData.invalidRequests,
    }
  };

  Object.entries(testSets).forEach(([collectionName, data]) => {
    describe(`insert ${collectionName}`, () => {
        
      test("should successfully insert valid documents", async () => {
        const collection = db.collection(collectionName);
        const result = await collection.insertMany(data.valid);
        expect(result.insertedCount).toBe(data.valid.length);
      });

      test("should raise document validation errors", async () => {
        const collection = db.collection(collectionName);
        data.invalid.forEach(async (doc) => {
          await expect(collection.insertOne(doc)).rejects.toThrow();
        });
      });

    });
  });
});
