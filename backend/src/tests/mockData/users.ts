import { User } from "@shared/types/db";
import { ObjectId } from "mongodb";
import { AlarmInterval, UserRole } from "../../utils";

export const validUsers: User[] = [
  {
    _id: new ObjectId(),
    email: "admin@mcgill.ca",
    password: "$2b$10$Oaaf4h.OQG.ZunWt69.n1.2K52Uec4L9l/fW4w6wsMBPxNlo.T4NW",
    firstName: "AdminFirstName",
    lastName: "AdminLastName",
    role: UserRole.ADMIN,
    notifications: {
      email: true,
      sms: true,
      alarm: AlarmInterval.MINUTE_1
    },
    upcomingMeetings: [],
    hostedMeetings: [],
    requests: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new ObjectId(),
    email: "user3@mcgill.ca",
    password: "$2b$10$nAMtjHIwpzBsghs7k9lcze1msR6nZCvo1oMNL.WflAHPGpZYBXVqG",
    firstName: "User",
    lastName: "Three",
    role: UserRole.MEMBER,
    notifications: {
      email: true,
      sms: true,
      alarm: AlarmInterval.MINUTE_15
    },
    upcomingMeetings: [
      {
        meetingId: new ObjectId(),
        title: "Meeting 1",
        hostFirstName: "Host",
        hostLastName: "One",
        location: "Location 1",
        time: "09:00-09:30",
        date: "2024-01-15",
        isCancelled: false
      },
      {
        meetingId: new ObjectId(),
        title: "Meeting 2",
        hostFirstName: "Host",
        hostLastName: "Two",
        location: "Location 2",
        time: "09:30-10:00",
        date: "2024-01-15",
        isCancelled: false
      },
      {
        meetingId: new ObjectId(),
        title: "Meeting 3",
        hostFirstName: "Host",
        hostLastName: "Three",
        location: "Location 3",
        time: "10:00-10:30",
        date: "2024-01-15",
        isCancelled: false
      }
    ],
    hostedMeetings: [],
    requests: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new ObjectId(),
    email: "user4@mail.mcgill.ca",
    password: "$2b$10$66Cr62H8MjEFeFQ.u5Iq9esgPfo8InjA4KAVACQHSNoIoHt.S/XsW",
    firstName: "User",
    lastName: "Four",
    role: UserRole.MEMBER,
    notifications: {
      email: true,
      sms: true,
      alarm: AlarmInterval.MINUTE_30
    },
    upcomingMeetings: [
      {
        meetingId: new ObjectId(),
        title: "Meeting 1",
        hostFirstName: "Host",
        hostLastName: "One",
        location: "Location 1",
        time: "09:00-09:30",
        date: "2024-01-15",
        isCancelled: false
      },
      {
        meetingId: new ObjectId(),
        title: "Meeting 2",
        hostFirstName: "Host",
        hostLastName: "Two",
        location: "Location 2",
        time: "09:30-10:00",
        date: "2024-01-15",
        isCancelled: false
      },
      {
        meetingId: new ObjectId(),
        title: "Meeting 3",
        hostFirstName: "Host",
        hostLastName: "Three",
        location: "Location 3",
        time: "10:00-10:30",
        date: "2024-01-15",
        isCancelled: false
      }
    ],
    hostedMeetings: [],
    requests: [],
    createdAt: new Date(),
    updatedAt: new Date()
  }

]

export const invalidUsers: any[] = [
  {
    // missing email field
    _id: new ObjectId(),
    password: "user1password",
    firstName: "User",
    lastName: "One",
    role: UserRole.MEMBER,
    notifications: {
      email: true,
      sms: true,
      alarm: AlarmInterval.MINUTE_10
    },
    upcomingMeetings: [new ObjectId()],
    hostedMeetings: [],
    requests: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new ObjectId(),
    email: "invalid_email", // invalid email format
    password: "user2password",
    firstName: "User",
    lastName: "Two",
    role: UserRole.MEMBER,
    notifications: {
      email: true,
      sms: true,
      alarm: AlarmInterval.MINUTE_10
    },
    upcomingMeetings: [],
    hostedMeetings: [],
    requests: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new ObjectId(),
    email: "user3@mcgill.ca",
    password: null, // password too short / invalid password
    firstName: "User",
    lastName: "Three",
    role: UserRole.MEMBER,
    notifications: {
      email: true,
      sms: true,
      alarm: AlarmInterval.MINUTE_10
    },
    upcomingMeetings: [],
    hostedMeetings: [],
    requests: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new ObjectId(),
    email: "user4@mcgill.ca",
    password: "user4password",
    firstName: "", // empty first name
    lastName: "Four",
    role: UserRole.MEMBER,
    notifications: {
      email: true,
      sms: true,
      alarm: AlarmInterval.MINUTE_10
    },
    upcomingMeetings: [],
    hostedMeetings: [],
    requests: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new ObjectId(),
    email: "user5@mcgill.ca",
    password: "user5password",
    firstName: "User",
    lastName: "", // empty last name
    role: UserRole.MEMBER,
    notifications: {
      email: true,
      sms: true,
      alarm: AlarmInterval.MINUTE_10
    },
    upcomingMeetings: [],
    hostedMeetings: [],
    requests: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new ObjectId(),
    email: "user6@mcgill.ca",
    password: "user6Pass1223!",
    firstName: "User",
    lastName: "Six",
    role: 10, // invalid role
    notifications: {
      email: true,
      sms: true,
      alarm: AlarmInterval.MINUTE_10
    },
    upcomingMeetings: [],
    hostedMeetings: [],
    requests: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new ObjectId(),
    email: "user7@mcgill.ca",
    password: "user7Pass1223!",
    firstName: "User",
    lastName: "Seven",
    role: UserRole.MEMBER,
    notifications: {
      email: "string", // invalid email notification type
      sms: true,
      alarm: AlarmInterval.MINUTE_10
    },
    upcomingMeetings: [],
    hostedMeetings: [],
    requests: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new ObjectId(),
    email: "user8@mcgill.ca",
    password: "user8Pass1223!",
    firstName: "User",
    lastName: "Eight",
    role: UserRole.MEMBER,
    notifications: {
      email: true,
      sms: "string", // invalid sms notification type
      alarm: AlarmInterval.MINUTE_10
    },
    upcomingMeetings: [],
    hostedMeetings: [],
    requests: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new ObjectId(),
    email: "user9@mcgill.ca",
    password: "user9Pass1223!",
    firstName: "User",
    lastName: "Nine",
    role: UserRole.MEMBER,
    notifications: {
      email: true,
      sms: true,
      alarm: 10 // invalid alarm interval
    },
    upcomingMeetings: [],
    hostedMeetings: [],
    requests: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new ObjectId(),
    email: "user10@mcgill.ca",
    password: "user10Pass1223!",
    firstName: "User",
    lastName: "Ten",
    role: UserRole.MEMBER,
    notifications: {
      email: true,
      sms: true,
      alarm: AlarmInterval.MINUTE_10
    },
    upcomingMeetings: [1], // invalid upcomingMeeting item
    hostedMeetings: [],
    requests: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new ObjectId(),
    email: "user11@mcgill.ca",
    password: "user11Pass1223!",
    firstName: "User",
    lastName: "Eleven",
    role: UserRole.MEMBER,
    notifications: {
      email: true,
      sms: true,
      alarm: AlarmInterval.MINUTE_10
    },
    upcomingMeetings: [],
    hostedMeetings: [2], // invalid hostedMeeting item
    requests: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new ObjectId(),
    email: "user12@mcgill.ca",
    password: "user12Pass1223!",
    firstName: "User",
    lastName: "Twelve",
    role: UserRole.MEMBER,
    notifications: {
      email: true,
      sms: true,
      alarm: AlarmInterval.MINUTE_10
    },
    upcomingMeetings: [],
    hostedMeetings: [],
    requests: [3], // invalid request item
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new ObjectId(),
    email: "user13@mcgill.ca",
    password: "user13Pass1223!",
    firstName: "User",
    lastName: "Thirteen",
    role: UserRole.MEMBER,
    notifications: {
      email: true,
      sms: true,
      alarm: AlarmInterval.MINUTE_10
    },
    upcomingMeetings: [],
    hostedMeetings: [],
    requests: [],
    createdAt: undefined, // invalid item
    updatedAt: new Date()
  },
  {
    _id: new ObjectId(),
    email: "user14@mcgill.ca",
    password: "user14Pass1223!",
    firstName: "User",
    lastName: "Fourteen",
    role: UserRole.MEMBER,
    notifications: {
      email: true,
      sms: true,
      alarm: AlarmInterval.MINUTE_10
    },
    upcomingMeetings: [],
    hostedMeetings: [],
    requests: [],
    createdAt: new Date(),
    updatedAt: undefined // invalid item
  }

]