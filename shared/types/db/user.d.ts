import { AlarmInterval, UserRole } from "../api/common";
import { ObjectId, Document } from "../../../backend/node_modules/mongodb"

interface UpcomingMeeting {
  meetingId: ObjectId;
  title: string;
  hostFirstName: string;
  hostLastName: string;
  location: string;
  time: string;
  date: string;
  isCancelled: boolean;
}

interface User extends Document {
    _id: ObjectId;
    email: string; // should end with @mail.mcgill.ca
    password: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    notifications: {
      email: boolean;
      sms: boolean;
      alarm: AlarmInterval;
    }
    upcomingMeetings: UpcomingMeeting[];
    hostedMeetings: ObjectId[];
    requests: ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}
