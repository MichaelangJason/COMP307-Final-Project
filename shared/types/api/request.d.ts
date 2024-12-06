import { RequestStatus } from './common';

export interface RequestParams {
  requestId: string; //
}

export interface RequestBody {
  
}

// get corresponding response status + date + time
export interface RequestResponse {
  message?: string;
  status: RequestStatus;
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

export interface RequestQuery {

}

