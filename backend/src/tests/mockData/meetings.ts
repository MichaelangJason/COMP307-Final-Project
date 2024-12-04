import { Meeting } from "@shared/types/db";
import { ObjectId } from "mongodb";
import { MeetingRepeat, MeetingStatus } from "status";

export const validMeetings: Meeting[] = [
  {
    _id: new ObjectId(),
    title: "Valid Meeting",
    description: "Valid Meeting Description",
    hostId: new ObjectId(),
    availabilities: [
      {
        date: "2024-01-01",
        slots: {
          "09:00-10:00": [
            {
              email: "test@test.com", // also allows non-mcgill emails
              firstName: "Test",
              lastName: "Test"
            }
          ],
          "10:00-11:00": [],
          "11:00-12:00": [
            {
              email: "test2@test.com",
              firstName: "Test2",
              lastName: "Test2"
            }
          ]
        },
        max: 10
      },
      {
        date: "2024-01-02",
        slots: {
          "09:00-10:00": [
            {
              email: "test@test.com", // also allows non-mcgill emails
              firstName: "Test",
              lastName: "Test"
            }
          ],
          "10:00-11:00": [],
          "11:00-12:00": [
            {
              email: "test2@test.com",
              firstName: "Test2",
              lastName: "Test2"
            }
          ]
        },
        max: 10
      },
    ],
    location: "Valid Location",
    status: MeetingStatus.UPCOMING,
    repeat: MeetingRepeat.ONCE,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new ObjectId(),
    title: "Valid Meeting",
    description: "Valid Meeting Description",
    hostId: new ObjectId(),
    availabilities: [],
    location: "Valid Location",
    status: MeetingStatus.UPCOMING,
    repeat: MeetingRepeat.ONCE,
    createdAt: new Date(),
    updatedAt: new Date()
  },
]

export const invalidMeetings: any[] = [

]