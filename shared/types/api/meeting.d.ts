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
  hostId: string;
  title: string;
  description: string;
  location: string;
  availabilities: MeetingAvailability[]; // participant should be private only, but we don't have time for that
  repeat: {
    type: MeetingRepeat;
    endDate: string;
  };
  pollInfo: PollInfo | null;
  status: MeetingStatus;
}
export interface MeetingInfoWithHost extends MeetingInfo {
  hostId: string;
  hostFirstName: string;
  hostLastName: string;
}

// get all hosted meetings response
export interface MeetingGetMultipleResponse {
  meetings: MeetingInfo[];
}

// create meeting
export interface MeetingCreateParams {
  hostId: string; // this means POST /meeting/:hostId
}
export interface MeetingCreateBody {
  // hostId: string; // will be removed
  title: string;
  description: string;
  location: string;
  availabilities: MeetingAvailability[];
  pollInfo?: PollInfo;
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
