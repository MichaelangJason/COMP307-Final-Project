import { MeetingAvailability } from "../db/meeting";
import { PollOption } from "../db/poll";
import { MeetingRepeat, MeetingStatus } from "./common";


export interface MeetingRequestParams {
  meetingId: string;
}

export interface MeetingCreateParams {
  hostId: string;
}

export interface PollInfo {
  options?: PollOption[];
  timeout: string;
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
  repeat: {
    type: MeetingRepeat;
    endDate: string;
  };
}

export interface MeetingUpdateBody extends Partial<MeetingCreateBody> {}
export interface MeetingBookingBody {
  userId?: string;
  participantInfo: {
    firstName: string;
    lastName: string;
    email: string;
  };
  date: string;
  slot: string;
}
export interface MeetingUnbookBody {
  userId?: string;
  email: string;
  date: string;
  slot: string;
}
export interface MeetingPublicInfoResponse extends MeetingInfo {
  hostId: string;
  status: MeetingStatus;
}

export interface MeetingCancelBody {
  date: string;
  slot: string;
}
