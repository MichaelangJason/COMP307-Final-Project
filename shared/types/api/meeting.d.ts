import { MeetingAvailability } from "../db/meeting";
import { MeetingRepeat, MeetingStatus } from "./common";

export interface MeetingInfo {
  title: string;
  description: string;
  location: string;
  availabilities: MeetingAvailability[];
  repeat: {
    type: MeetingRepeat;
    endDate: string;
  };
}

export interface MeetingInfoResponse extends MeetingInfo {
  hostId: string;
  status: MeetingStatus;
}

export interface MeetingCreateBody extends MeetingInfo {
  hostId: string;
}

export interface MeetingBookingBody {
  hostId: string;
  participantInfo: {
    firstName: string;
    lastName: string;
    email: string;
  };
  date: string;
  time: string;
}

export interface MeetingPublicInfoResponse extends MeetingInfo {
  hostId: string;
  status: MeetingStatus;
}
