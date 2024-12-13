import { RequestStatus } from './common';

export interface RequestParams {
  requestId: string; // host id (for creating request), user id (for managing request)
}

export interface RequestUpdateBody {
  status: RequestStatus; // can only update status
}

export interface RequestInfo {
  proposerInfo: {
    firstName: string;
    lastName: string;
    email: string;
  },
  proposedSlot: {
    date: string;
    time: string;
  },
  reason: string;
}

// get corresponding response status + date + time
export interface RequestInfoResponse extends RequestInfo {
  status: RequestStatus;
}

export interface RequestCreateBody extends RequestInfo {
  hostId: string; // host id (for creating request)
}

