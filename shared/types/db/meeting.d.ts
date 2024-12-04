import { ObjectId } from "mongodb";
import { MeetingStatus, MeetingRepeat } from "../api/common";

interface Participant {
  email: string;
  firstName: string;
  lastName: string;
}

interface MeetingAvailability {
  date: string;
  slots: Record<string, Participant[]>;
  max: number;
}

interface Meeting {
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
  createdAt: Date;
  updatedAt: Date;
}