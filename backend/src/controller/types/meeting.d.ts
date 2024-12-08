import { Meeting, MeetingAvailability } from "@shared/types/db";
import { MeetingCreateBody, MeetingCreateParams, MeetingInfo, MeetingRequestParams } from "@shared/types/api/meeting";
import { Request, Response } from 'express'


type MessageResponse = {
  message: string;
}

// get info
export type MeetingRequest = Request<MeetingRequestParams, MeetingInfo | MessageResponse>; // no body, no query, no locals
export type MeetingResponse = Response<MeetingInfo | MessageResponse>;

// create meeting
export type MeetingCreateRequest = Request<MeetingCreateParams, MeetingInfo | MessageResponse, MeetingCreateBody>; // no query, no locals
export type MeetingCreateResponse = Response<MeetingInfo | MessageResponse>;
