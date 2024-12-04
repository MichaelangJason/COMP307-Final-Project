import { Request } from "@shared/types/db";
import { RequestStatus } from "status";
import { ObjectId } from "mongodb";

export const validRequests: Request[] = [
  {
    _id: new ObjectId(),
    proposedSlot: {
      date: "2024-01-01",
      time: "00:00-01:00"
    },
    status: RequestStatus.PENDING,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new ObjectId(),
    proposedSlot: {
      date: "2024-01-01",
      time: "00:00-01:00"
    },
    status: RequestStatus.ACCEPTED,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new ObjectId(),
    proposedSlot: {
      date: "2024-01-01",
      time: "00:00-01:00"
    },
    status: RequestStatus.DECLINED,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new ObjectId(),
    proposedSlot: {
      date: "2024-01-01",
      time: "00:00-01:00"
    },
    status: RequestStatus.EXPIRED,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

export const invalidRequests: any[] = [
  {
    _id: new ObjectId(),
    proposedSlot: {
      date: "invalid-date", // Invalid date format
      time: "00:00-01:00"
    },
    status: RequestStatus.PENDING,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new ObjectId(),
    proposedSlot: {
      date: "2024-01-01",
      time: "25:00-26:00" // Invalid time format
    },
    status: RequestStatus.PENDING,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new ObjectId(),
    proposedSlot: {
      date: "2024-01-01",
      // Missing required time field
    },
    status: RequestStatus.PENDING,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new ObjectId(),
    // Missing required proposedSlot field
    status: RequestStatus.PENDING,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new ObjectId(),
    proposedSlot: {
      date: "2024-01-01",
      time: "00:00-01:00"
    },
    status: 5, // Invalid status enum value
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new ObjectId(),
    proposedSlot: {
      date: "2024-01-01",
      time: "00:00-01:00"
    },
    status: RequestStatus.PENDING,
    // Missing required createdAt field
    updatedAt: new Date()
  },
  {
    _id: new ObjectId(),
    proposedSlot: {
      date: "2024-01-01",
      time: "00:00-01:00"
    },
    status: RequestStatus.PENDING,
    createdAt: "2024-01-01", // Invalid date type - should be Date object
    updatedAt: new Date()
  },
  {
    _id: new ObjectId(), 
    proposedSlot: {
      date: 20240101, // Invalid date type - should be string
      time: "00:00-01:00"
    },
    status: RequestStatus.PENDING,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new ObjectId(),
    proposedSlot: {
      date: "2024-01-01",
      time: 1200 // Invalid time type - should be string
    },
    status: RequestStatus.PENDING, 
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new ObjectId(),
    proposedSlot: {
      date: "2024-01-01",
      time: "00:00-01:00"
    },
    status: "PENDING", // Invalid status type - should be number
    createdAt: new Date(),
    updatedAt: new Date()
  }
]
