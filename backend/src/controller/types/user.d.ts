import { Request, Response } from "express";
import { UserParams, UserGetResponse, UserProfileUpdateBody } from "@shared/types/api/user";

// common
export type MessageResponse = {
  message: string;
  error?: any;
  name?: string;
}

// get user info
export type UserGetRequest = Request<UserParams, UserGetResponse>;
export type UserGetResponse = Response<UserGetResponse | MessageResponse>;

// update user info
export type UserUpdateRequest = Request<UserParams, UserUpdateResponse, UserProfileUpdateBody>;
export type UserUpdateResponse = Response<MessageResponse>;