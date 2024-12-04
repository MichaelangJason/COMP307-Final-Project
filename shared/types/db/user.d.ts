import { AlarmInterval, UserRole } from "../api/common";
import { ObjectId } from "mongodb";

interface User {
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
    upcomingMeetings: ObjectId[];
    hostedMeetings: ObjectId[];
    requests: ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}
