import { Meeting, MeetingAvailability } from "@shared/types/db";
import { MeetingInfo, MeetingRequestParams } from "@shared/types/api/meeting";
import { Request, Response } from 'express'


type MessageResponse = {
  message?: string;
}

export type MeetingRequest = Request<MeetingRequestParams, MeetingInfo | MessageResponse>; // no body, no query, no locals
export type MeetingResponse = Response<MeetingInfo | MessageResponse>; // no body, no query, no locals
