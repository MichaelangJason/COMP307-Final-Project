import { Request, Response } from 'express';
import { RequestParams, RequestResponse, RequestBody, RequestQuery } from '@shared/types/api/request';

export type RequestInfoRequest = Request<RequestParams, RequestResponse, RequestBody, RequestQuery>;

export type RequestInfoResponse = Response<RequestResponse>;
