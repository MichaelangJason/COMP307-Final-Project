import { User } from "@shared/types/db";
import { ObjectId } from "mongodb";
import { AlarmInterval, UserRole } from "../../utils";

export const validUsers: any[] = [
  {
    _id: new ObjectId(),
    email: "test@mail.mcgill.ca",
    password: "TestPass1223asdf",
    firstName: "Test",
    lastName: "Test",
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
    password: "user3Pass1223!",
    firstName: "User",
    lastName: "Three",
    role: UserRole.MEMBER,
    notifications: {
      email: true,
      sms: true,
      alarm: AlarmInterval.MINUTE_15
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
    password: "user4Pass1223!",
    firstName: "User",
    lastName: "Four",
    role: UserRole.ADMIN,
    notifications: {
      email: true,
      sms: true,
      alarm: AlarmInterval.MINUTE_30
    },
    upcomingMeetings: [],
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