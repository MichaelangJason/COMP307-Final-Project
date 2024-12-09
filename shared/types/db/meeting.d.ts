import { ObjectId, Document } from "mongodb";
import { MeetingStatus, MeetingRepeat } from "../api/common";

export interface Participant {
  email: string;
  firstName: string;
  lastName: string;
  userId?: ObjectId;
}

export interface MeetingAvailability {
  date: string;
  slots: Record<string, Participant[]>;
  max: number;
}

interface Meeting extends Document {
  _id: ObjectId;
  title: string;
  description: string;
  hostId: ObjectId;
  availabilities: MeetingAvailability[];
  location: string;
  status: MeetingStatus;
  repeat: {
    type: MeetingRepeat;
    endDate: string;
  };
  pollId?: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}