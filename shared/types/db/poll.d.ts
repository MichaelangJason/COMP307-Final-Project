import { ObjectId } from "mongodb";

interface PollOption {
  date: string;
  slots: Record<string, number>;
}

interface Poll {
  _id: ObjectId;
  options: PollOption[];
  timeout: Date;
  results: number;
  createdAt: Date;
  updatedAt: Date;
}