// Jiaju Nie
import { Meeting } from "@shared/types/db";
import { ObjectId } from "mongodb";
import { MeetingRepeat, MeetingStatus } from "../../utils";

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
    repeat: {
      type: MeetingRepeat.ONCE,
      endDate: "2024-01-03"
    },
    pollId: new ObjectId(),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new ObjectId(),
    title: "Team Standup",
    description: "Daily team sync meeting",
    hostId: new ObjectId(),
    availabilities: [
      {
        date: "2024-02-01",
        slots: {
          "13:00-14:00": [],
          "14:00-15:00": [
            {
              email: "john.doe@mcgill.ca",
              firstName: "John",
              lastName: "Doe"
            }
          ],
          "15:00-16:00": []
        },
        max: 5
      }
    ],
    location: "Conference Room A",
    status: MeetingStatus.VOTING,
    repeat: {
      type: MeetingRepeat.WEEKLY,
      endDate: "2024-03-01"
    },
    pollId: new ObjectId(),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new ObjectId(),
    title: "Project Review",
    description: "Monthly project status review",
    hostId: new ObjectId(),
    availabilities: [
      {
        date: "2024-03-15",
        slots: {
          "10:00-11:30": [
            {
              email: "jane.smith@mail.mcgill.ca", 
              firstName: "Jane",
              lastName: "Smith"
            },
            {
              email: "bob.wilson@mcgill.ca",
              firstName: "Bob", 
              lastName: "Wilson"
            }
          ],
          "13:00-14:30": []
        },
        max: 8
      }
    ],
    location: "Virtual Meeting Room",
    status: MeetingStatus.UPCOMING,
    repeat: {
      type: MeetingRepeat.ONCE,
      endDate: "2024-03-15"
    },
    pollId: new ObjectId(),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new ObjectId(),
    title: "Office Hours",
    description: "Professor office hours",
    hostId: new ObjectId(),
    availabilities: [
      {
        date: "2024-12-23",
        slots: {
          "09:00-09:30": [],
          "09:30-10:00": [
            {
              email: "student1@mail.mcgill.ca",
              firstName: "Student",
              lastName: "One"
            }
          ],
          "10:00-10:30": [
            {
              email: "student2@mail.mcgill.ca",
              firstName: "Student",
              lastName: "Two"
            }
          ]
        },
        max: 1
      },
      {
        date: "2024-12-24",
        slots: {
          "09:00-09:30": [],
          "09:30-10:00": [],
          "10:00-10:30": []
        },
        max: 1
      }
    ],
    location: "Office 302",
    status: MeetingStatus.UPCOMING,
    repeat: {
      type: MeetingRepeat.WEEKLY,
      endDate: "2024-12-30"
    },
    pollId: new ObjectId(),
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

export const invalidMeetings: any[] = [
  {
    // Missing required fields
    _id: new ObjectId(),
    title: "Invalid Meeting",
    hostId: new ObjectId()
  },
  {
    // Invalid status value
    _id: new ObjectId(),
    title: "Invalid Meeting",
    description: "Meeting with invalid status",
    hostId: new ObjectId(),
    availabilities: [],
    location: "Room 101",
    status: "INVALID_STATUS",
    repeat: {
      type: MeetingRepeat.ONCE,
      endDate: "2024-01-01"
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    // Invalid repeat type
    _id: new ObjectId(), 
    title: "Invalid Meeting",
    description: "Meeting with invalid repeat",
    hostId: new ObjectId(),
    availabilities: [], // availability > 0
    location: "Room 101",
    status: MeetingStatus.UPCOMING,
    repeat: {
      type: "INVALID_REPEAT",
      endDate: "2024-01-01"
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    // Invalid availability structure
    _id: new ObjectId(),
    title: "Invalid Meeting",
    description: "Meeting with invalid availability",
    hostId: new ObjectId(),
    availabilities: [
      {
        date: "2024-01-01",
        slots: {
          "invalid-time-format": []
        },
        max: -1 // Invalid max value
      }
    ],
    location: "Room 101",
    status: MeetingStatus.UPCOMING,
    repeat: {
      type: MeetingRepeat.ONCE,
      endDate: "2024-01-01"
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    // Invalid participant data
    _id: new ObjectId(),
    title: "Invalid Meeting",
    description: "Meeting with invalid participant",
    hostId: new ObjectId(),
    availabilities: [
      {
        date: "2024-01-01",
        slots: {
          "09:00-10:00": [
            {
              email: "invalid-email", // Invalid email format
              firstName: "", // Empty name
              lastName: "" // Empty name
            }
          ]
        },
        max: 1
      }
    ],
    location: "Room 101",
    status: MeetingStatus.UPCOMING,
    repeat: {
      type: MeetingRepeat.WEEKLY,
      endDate: "2024-01-01"
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new ObjectId(),
    title: "Invalid Meeting",
    description: "Meeting with empty slots",
    hostId: new ObjectId(),
    availabilities: [
      {
        date: "2024-01-01",
        slots: {},
        max: 1
      }
    ],
    location: "Room 101", 
    status: MeetingStatus.UPCOMING,
    repeat: {
      type: MeetingRepeat.ONCE,
      endDate: "2024-01-01"
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
]