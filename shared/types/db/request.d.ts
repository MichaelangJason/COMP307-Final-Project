import { Document, ObjectId } from "mongodb";
import { RequestStatus } from "../api/common";

export interface Request extends Document {
  _id: ObjectId;
  proposerInfo: {
    firstName: string;
    lastName: string;
    email: string;
  }
  proposedSlot: {
    date: string;
    time: string;
  };
  status: RequestStatus;
  reason: string;
  createdAt: Date;
  updatedAt: Date;
}