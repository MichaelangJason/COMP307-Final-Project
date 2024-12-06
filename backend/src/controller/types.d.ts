import { Request, Response } from 'express';
import { RequestParams, RequestInfoResponse, RequestBody, RequestQuery, RequestUpdateBody } from '@shared/types/api/request';

type MessageResponse = {
  message?: string;
}

export type RequestInfoRequest = Request<RequestParams, RequestInfoResponse, {}, RequestQuery>;

export type RequestInfoResponse = Response<RequestInfoResponse | MessageResponse>;

export type RequestUpdateRequest = Request<RequestParams, RequestUpdateBody, {}, RequestQuery>;

export type RequestUpdateResponse = Response<MessageResponse>;
