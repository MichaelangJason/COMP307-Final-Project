import { ObjectId } from "../../../backend/node_modules/mongodb";
import { AlarmInterval, UserRole } from "./common";
import { UpcomingMeeting, User } from "../db/user";

// common
export interface UserParams {
  userId: string;
}

// get user info
export interface UserGetResponse {
  id: string;
  email: string;
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
}

// update user info
export interface UserProfileUpdateBody {
  password?: string;
  notifications?: {
    email: boolean;
    sms: boolean;
    alarm: AlarmInterval;
  }
}