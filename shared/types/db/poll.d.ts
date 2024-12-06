import { ObjectId, Document } from "mongodb";

interface PollOption {
  date: string;
  slots: Record<string, number>;
}

interface Poll extends Document {
  _id: ObjectId;
  options: PollOption[];
  timeout: Date;
  results: number;
  createdAt: Date;
  updatedAt: Date;
}