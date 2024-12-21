// Jiaju Nie
import { ObjectId } from 'mongodb'
import { Request, Response } from 'express'
import { PollGetResponse, PollParams, PollVoteBody } from '@shared/types/api/poll'

// common
export type MessageResponse = {
  message: string;
  error?: any;
}

// get poll
export type PollGetRequest = Request<PollParams, PollGetResponse>;
export type PollGetResponse = Response<PollGetResponse | MessageResponse>;

// vote poll
export type PollVoteRequest = Request<PollParams, MessageResponse, PollVoteBody>;
export type PollVoteResponse = Response<MessageResponse>;
