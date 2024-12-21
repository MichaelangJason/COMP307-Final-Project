// Jiaju Nie
import { Request, Response } from 'express';
import { RequestParams, RequestInfoResponse, RequestQuery, RequestUpdateBody, RequestCreateBody } from '@shared/types/api/request';

type MessageResponse = {
  message?: string;
}

// create request 
export type RequestCreateRequest = Request<{}, MessageResponse, RequestCreateBody>;
export type RequestCreateResponse = Response<MessageResponse>;

// get request info
export type RequestInfoRequest = Request<RequestParams, RequestInfoResponse>;
export type RequestInfoResponse = Response<RequestInfoResponse | MessageResponse>;

// update request
export type RequestUpdateRequest = Request<RequestParams, MessageResponse, RequestUpdateBody>;
export type RequestUpdateResponse = Response<MessageResponse>;
