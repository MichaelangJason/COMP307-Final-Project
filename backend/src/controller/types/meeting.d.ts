import { Meeting, MeetingAvailability } from "@shared/types/db";
import { MeetingCreateBody, MeetingCreateParams, MeetingInfo, MeetingInfoWithHost, MeetingRequestParams, MeetingBookingBody, MeetingUnbookBody, MeetingCancelBody } from "@shared/types/api/meeting";
import { Request, Response } from 'express'


type MessageResponse = {
  message: string;
}

// get info
export type MeetingRequest = Request<MeetingRequestParams, MeetingInfoWithHost | MessageResponse>; // no body, no query, no locals
export type MeetingResponse = Response<MeetingInfoWithHost | MessageResponse>;

// create meeting
export type MeetingCreateRequest = Request<MeetingCreateParams, MeetingInfo | MessageResponse, MeetingCreateBody>; // no query, no locals
export type MeetingCreateResponse = Response<MeetingInfo | MessageResponse>;

// update meeting
export type MeetingUpdateRequest = Request<MeetingRequestParams, MessageResponse, MeetingUpdateBody>; // no query, no locals
export type MeetingUpdateResponse = Response<MessageResponse>;

// book meeting
export type MeetingBookRequest = Request<MeetingRequestParams, MessageResponse, MeetingBookingBody>; // no query, no locals
export type MeetingBookResponse = Response<MessageResponse>;

// unbook meeting
export type MeetingUnbookRequest = Request<MeetingRequestParams, MessageResponse, MeetingUnbookBody>; // no query, no locals
export type MeetingUnbookResponse = Response<MessageResponse>;

// cancel meeting
export type MeetingCancelRequest = Request<MeetingRequestParams, MessageResponse, MeetingCancelBody>; // no query, no locals
export type MeetingCancelResponse = Response<MessageResponse>;
