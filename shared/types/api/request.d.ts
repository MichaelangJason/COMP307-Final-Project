import { Request, Response } from 'express';
import { RequestStatus } from './common';

export interface RequestParams {
  requestId: string; //
}

export interface RequestBody {
  
}

// get corresponding response status + date + time
export interface RequestResponse {
  status: RequestStatus;
  proposedSlot: {
    date: string;
    time: string;
  }
}

export interface RequestQuery {

}

// hahahhhaha
export type RequestRequest = Request<RequestParams, RequestResponse, RequestBody, RequestQuery>;

