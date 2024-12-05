import {
  describe,
  test,
  expect,
  afterEach,
  beforeAll,
  afterAll,
} from "@jest/globals";
import { MongoClient, Db } from "mongodb";
import { MongoMemoryServer } from "mongodb-memory-server";
import schemas from "./schemas";
import mockData from "../mockData";
import { Meeting, Poll, User, Request } from "@shared/types/db";
import { AlarmInterval, RequestStatus, UserRole } from "status";

describe("Updating data in different collections", () => {
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
  // afterEach(async () => {
  //   if (db) {
  //     const collections = await db.collections();
  //     for (const collection of collections) {
  //       await collection.deleteMany({});
  //     }
  //   }
  // });

  const validSet = {
    user: {
      source: mockData.validUsers[0],
      update: {
        email: "newemail@mcgill.ca",
        password: "NewPass123!",
        firstName: "NewFirstName",
        lastName: "NewLastName",
        role: UserRole.MEMBER,
        notifications: {
          email: false, sms: false, alarm: AlarmInterval.MINUTE_30
        },
        upcomingMeetings: [
          {
            meetingId: mockData.validMeetings[0]._id,
            time: "10:00-11:00",
            date: "2024-01-01"
          }
        ],
        hostedMeetings: [mockData.validMeetings[0]._id],
        requests: [mockData.validRequests[1]._id],
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-02")
      }
    },
    // meeting: {
    //   source: mockData.validMeetings[0]
    // }
    request: {
      source: mockData.validRequests[0],
      update: {
        proposedSlot: {
          date: "2024-01-02", 
          time: "10:00-11:00"
        },
        status: RequestStatus.EXPIRED,
        updatedAt: new Date("2024-01-02"),
        createdAt: new Date("2024-01-01")
      }
    },
    poll: {
      source: mockData.validPolls[0],
      update: {
        options: [
          {
            date: "2024-01-01",
            slots: {
              "10:00-11:00": 1,
              "11:00-12:00": 2,
              "12:00-13:00": 3
            }
          },
          {
            date: "2024-01-02",
            slots: {
              "10:00-11:00": 4,
              "11:00-12:00": 5,
              "12:00-13:00": 6
            }
          }
        ],
        timeout: new Date(),
        results: 10,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    }
  }

  Object.entries(validSet).forEach(([collection, data]) => {
    describe(`update ${collection}`, () => {
      let source: User | Meeting | Request | Poll;

      beforeAll(async () => {
        const insertResult = await db.collection(collection).insertOne(data.source);
        expect(insertResult.insertedId).toBe(data.source._id);
        source = (await db.collection(collection).find().toArray())[0] as User | Meeting | Request | Poll;
      });

      Object.entries(data.update).forEach(([key, value]) => {
        test(`Should update ${key}`, async () => {
          const updateResult = await db.collection(collection).updateOne({ _id: source._id }, { $set: { [key]: value } });
          expect(updateResult.modifiedCount).toBe(1);
          source = (await db.collection(collection).find().toArray())[0] as User | Meeting | Request | Poll;
          expect((source as any)[key]).toEqual(value);
        });
      });
    });
  });



  describe("update meeting", () => {});
  describe("update request", () => {});
  describe("update poll", () => {});
});
