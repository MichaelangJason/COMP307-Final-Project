import { MeetingAvailability } from "../db/meeting";
import { MeetingRepeat, MeetingStatus } from "./common";


export interface MeetingRequestParams {
  meetingId: string;
}

export interface PollInfo {
  options: PollOption[];
  timeout: Date;
  results: number;
}

export interface MeetingInfo extends MeetingRequestParams {
  title: string;
  description: string;
  location: string;
  availabilities: MeetingAvailability[];
  pollInfo: PollInfo | null;
  status: MeetingStatus;
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
