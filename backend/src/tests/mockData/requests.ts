// Jiaju Nie
import { Request } from "@shared/types/db";
import { RequestStatus } from "../../utils";
import { ObjectId } from "mongodb";

export const validRequests: Request[] = [
  {
    _id: new ObjectId(),
    proposerInfo: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com"
    },
    hostId: new ObjectId(),
    proposedSlot: {
      date: "2024-01-01",
      time: "00:00-01:00"
    },
    status: RequestStatus.PENDING,
    reason: "",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new ObjectId(),
    hostId: new ObjectId(),
    proposerInfo: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com"
    },
    proposedSlot: {
      date: "2024-01-01",
      time: "00:00-01:00"
    },
    status: RequestStatus.ACCEPTED,
    reason: "asdfasd",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new ObjectId(),
    hostId: new ObjectId(),
    proposerInfo: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com"
    },
    proposedSlot: {
      date: "2024-01-01",
      time: "00:00-01:00"
    },
    status: RequestStatus.DECLINED,
    reason: "asdfasd",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new ObjectId(),
    hostId: new ObjectId(),
    proposerInfo: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com"
    },
    proposedSlot: {
      date: "2024-01-01",
      time: "00:00-01:00"
    },
    status: RequestStatus.EXPIRED,
    reason: "asdfasd",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

export const invalidRequests: any[] = [
  {
    _id: new ObjectId(),
    hostId: new ObjectId(),
    proposerInfo: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com"
    },
    proposedSlot: {
      date: "invalid-date", // Invalid date format
      time: "00:00-01:00"
    },
    status: RequestStatus.PENDING,
    reason: "asdfasd",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new ObjectId(),
    hostId: new ObjectId(),
    proposerInfo: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com"
    },
    proposedSlot: {
      date: "2024-01-01",
      time: "25:00-26:00" // Invalid time format
    },
    status: RequestStatus.PENDING,
    reason: "asdfasd",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new ObjectId(),
    hostId: new ObjectId(),
    proposerInfo: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com"
    },
    proposedSlot: {
      date: "2024-01-01",
      // Missing required time field
    },
    status: RequestStatus.PENDING,
    reason: "asdfasd",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new ObjectId(),
    hostId: new ObjectId(),
    // Missing required proposedSlot field
    status: RequestStatus.PENDING,
    reason: "asdfasd",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new ObjectId(),
    hostId: new ObjectId(),
    proposerInfo: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com"
    },
    proposedSlot: {
      date: "2024-01-01",
      time: "00:00-01:00"
    },
    status: 5, // Invalid status enum value
    reason: "asdfasd",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new ObjectId(),
    hostId: new ObjectId(),
    proposerInfo: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com"
    },
    proposedSlot: {
      date: "2024-01-01",
      time: "00:00-01:00"
    },
    status: RequestStatus.PENDING,
    reason: "asdfasd",
    // Missing required createdAt field
    updatedAt: new Date()
  },
  {
    _id: new ObjectId(),
    hostId: new ObjectId(),
    proposerInfo: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com"
    },
    proposedSlot: {
      date: "2024-01-01",
      time: "00:00-01:00"
    },
    status: RequestStatus.PENDING,
    reason: "asdfasd",
    createdAt: "2024-01-01", // Invalid date type - should be Date object
    updatedAt: new Date()
  },
  {
    _id: new ObjectId(), 
    hostId: new ObjectId(),
    proposerInfo: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com"
    },
    proposedSlot: {
      date: 20240101, // Invalid date type - should be string
      time: "00:00-01:00"
    },
    status: RequestStatus.PENDING,
    reason: "asdfasd",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new ObjectId(),
    hostId: new ObjectId(),
    proposerInfo: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com"
    },
    proposedSlot: {
      date: "2024-01-01",
      time: 1200 // Invalid time type - should be string
    },
    status: RequestStatus.PENDING, 
    reason: "asdfasd",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new ObjectId(),
    hostId: new ObjectId(),
    proposerInfo: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com"
    },
    proposedSlot: {
      date: "2024-01-01",
      time: "00:00-01:00"
    },
    status: "PENDING", // Invalid status type - should be number
    reason: "asdfasd",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new ObjectId(),
    hostId: new ObjectId(),
    proposerInfo: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com"
    },
    proposedSlot: {
      date: "2024-01-01",
      time: "00:00-01:00"
    },
    status: RequestStatus.PENDING, // Invalid status type - should be number
    reason: null,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new ObjectId(),
    hostId: new ObjectId(),
    // Missing required proposerInfo field
    proposedSlot: {
      date: "2024-01-01",
      time: "00:00-01:00"
    },
    status: RequestStatus.PENDING,
    reason: "asdfasd",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]
