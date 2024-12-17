import {
  describe,
  test,
  expect,
  afterEach,
  beforeAll,
  afterAll,
} from "@jest/globals";
import { MongoClient, Db, ObjectId } from "mongodb";
import { MongoMemoryServer } from "mongodb-memory-server";
import schemas from "./schemas";
import mockData from "../mockData";
import { Meeting, Poll, User, Request } from "@shared/types/db";
import { AlarmInterval, MeetingRepeat, MeetingStatus, RequestStatus, UserRole } from "../../utils";

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

  const testSet = {
    user: {
      source: mockData.validUsers[0],
      validUpdate: {
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
            date: "2024-01-01",
            isCancelled: true
          }
        ],
        hostedMeetings: [mockData.validMeetings[1]._id, mockData.validMeetings[2]._id],
        requests: [mockData.validRequests[1]._id],
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-02")
      },
      invalidUpdate: {
        email: "invalidemail@test.mcgill.ca",
        password: null,
        firstName: "",
        lastName: "",
        role: 10,
        notifications: {
          email: true, sms: true, alarm: 10
        },
        upcomingMeetings: null,
        hostedMeetings: null,
        requests: null,
        createdAt: null,
        updatedAt: null
      }
    },
    meeting: {
      source: mockData.validMeetings[0],
      validUpdate: {
        title: "NewTitle",
        description: "NewDescription",
        hostId: new ObjectId(),
        availabilities: [
          {
            date: "2024-01-02",
            slots: {
              "10:00-11:00": [
                {
                  email: "test@test.com",
                  firstName: "Test",
                  lastName: "Test"
                }
              ],
              "11:00-12:00": [],
              "12:00-13:00": []
            },
            max: 10
          },
          {
            date: "2024-01-03",
            slots: {
              "10:00-11:00": [],
              "14:00-15:00": [
                {
                  email: "test2@test.com",
                  firstName: "Test2",
                  lastName: "Test2"
                }
              ],
              "16:00-17:00": []
            },
            max: 20
          }
        ],
        location: "NewLocation",
        status: MeetingStatus.VOTING,
        repeat: {
          type: MeetingRepeat.WEEKLY,
          endDate: "2024-01-05"
        },
        pollId: new ObjectId(),
        updatedAt: new Date("2024-01-03"),
        createdAt: new Date("2024-01-02")
      },
      invalidUpdate: {
        title: "",
        description: "This is a very long description that should definitely fail validation because it is over 50 characters",
        hostId: null,
        availabilities: [
          {
            date: "2024-01-",
            slots: {
              "10:-11:00": [
                {
                  email: "test@test.com",
                  firstName: "Test",
                  lastName: "Test"
                }
              ],
              "11:00-100": [],
              "12:00-13:00": []
            },
            max: 10
          },
          {
            date: "2024-01-03",
            slots: {
              "10:00-11:00": [],
              "14:00-15:00": [
                {
                  email: "test2@test.com",
                  firstName: "Test2",
                  lastName: "Test2"
                }
              ],
              "16:00-17:00": []
            },
            max: 20
          }
        ],
        location: "",
        status: 10,
        repeat: {
          type: 10,
          endDate: "2024--05"
        },
        pollId: null,
        updatedAt: null,
        createdAt: null
      }
    },
    request: {
      source: mockData.validRequests[0],
      validUpdate: {
        proposerInfo: {
          firstName: "NewFirstName",
          lastName: "NewLastName",
          email: "newemail@test.com"
        },
        proposedSlot: {
          date: "2024-01-02", 
          time: "10:00-11:00"
        },
        reason: "NewReason",
        status: RequestStatus.EXPIRED,
        updatedAt: new Date("2024-01-02"),
        createdAt: new Date("2024-01-01")
      },
      invalidUpdate: {
        proposerInfo: {
          firstName: "",
          lastName: "",
          email: "invalidemail@com"
        },
        proposedSlot: {
          date: "10:00-11:00",
          time: "2024-01-02"
        },
        status: 10,
        reason: null,
        updatedAt: null,
        createdAt: null
      }
    },
    poll: {
      source: mockData.validPolls[0],
      validUpdate: {
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
        meetingId: new ObjectId(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      invalidUpdate: {
        options: [
          {
            date: "2024-01-01",
            slots: {
              "00-11:00": -1,
            }
          }
        ],
        timeout: null,
        results: -1,
        meetingId: null,
        createdAt: null,
        updatedAt: null
      }
    }
  }

  Object.entries(testSet).forEach(([collection, data]) => {
    describe(`update ${collection}`, () => {
      let source: User | Meeting | Request | Poll;

      beforeAll(async () => {
        const insertResult = await db.collection(collection).insertOne(data.source);
        expect(insertResult.insertedId).toBe(data.source._id);
        source = (await db.collection(collection).find().toArray())[0] as User | Meeting | Request | Poll;
      });

      Object.entries(data.validUpdate).forEach(([key, value]) => {
        test(`Should update ${key}`, async () => {
          const updateResult = await db.collection(collection).updateOne({ _id: source._id }, { $set: { [key]: value } });
          expect(updateResult.modifiedCount).toBe(1);
          source = (await db.collection(collection).find().toArray())[0] as User | Meeting | Request | Poll;
          expect((source as any)[key]).toEqual(value);
        });
      });

      Object.entries(data.invalidUpdate).forEach(([key, value]) => {
        test(`Should not update ${key}`, async () => {
          await expect(db.collection(collection).updateOne({ _id: source._id }, { $set: { [key]: value } })).rejects.toThrow("Document failed validation");
          source = (await db.collection(collection).find().toArray())[0] as User | Meeting | Request | Poll;
          expect((source as any)[key]).not.toEqual(value);
        });
      });
    });
  });
});
