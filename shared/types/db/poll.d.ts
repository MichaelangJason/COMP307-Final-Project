import { ObjectId, Document } from "../../../backend/node_modules/mongodb"

export interface PollOption {
  date: string;
  slots: Record<string, number>;
}

export interface Poll extends Document {
  _id: ObjectId;
  meetingId: ObjectId;
  options: PollOption[];
  timeout: Date;
  results: number;
  createdAt: Date;
  updatedAt: Date;
}