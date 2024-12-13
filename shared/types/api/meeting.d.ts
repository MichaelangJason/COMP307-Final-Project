import { MeetingAvailability } from "../db/meeting";
import { PollOption } from "../db/poll";
import { MeetingRepeat, MeetingStatus } from "./common";


// common
export interface PollInfo {
  options?: PollOption[];
  timeout: string;
  results: number;
}
export interface MeetingRequestParams {
  meetingId: string;
}
export interface MeetingInfo extends MeetingRequestParams {
  title: string;
  description: string;
  location: string;
  availabilities: MeetingAvailability[];
  pollInfo: PollInfo | null;
  status: MeetingStatus;
}

// create meeting
export interface MeetingCreateParams {
  hostId: string; // this means POST /meeting/:hostId
}
export interface MeetingCreateBody extends MeetingInfo {
  repeat: {
    type: MeetingRepeat;
    endDate: string;
  };
}

// update existing meeting
export interface MeetingUpdateBody extends Partial<MeetingCreateBody> {}

// book meeting
export interface MeetingBookingBody {
  userId?: string; // for logged in user 
  participantInfo: {
    firstName: string;
    lastName: string;
    email: string;
  };
  date: string;
  slot: string;
}

// unbook meeting
export interface MeetingUnbookBody {
  userId?: string;
  email: string;
  date: string;
  slot: string;
}

// cancel meeting
export interface MeetingCancelBody {
  date: string;
  slot: string;
}
