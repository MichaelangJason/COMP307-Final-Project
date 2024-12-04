import { ObjectId } from "mongodb";
import { RequestStatus } from "../api/common";

interface Request {
  _id: ObjectId;
  proposedSlot: {
    date: string;
    time: string;
  };
  status: RequestStatus;
  createdAt: Date;
  updatedAt: Date;
}