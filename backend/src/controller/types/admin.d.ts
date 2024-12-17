import { Request, Response } from "express";
import { AdminDeleteParams, AdminGetResponse, MessageResponse, AdminGetQuery, AdminLoginAsUserParams, AdminLoginAsUserResponse } from "@shared/types/api/admin";

// get all users
export type AdminGetRequest = Request<{}, AdminGetResponse>;
export type AdminGetResponse = Response<AdminGetResponse | MessageResponse>;

// search users
export type AdminSearchRequest = Request<{}, AdminGetResponse, {}, AdminGetQuery>;
export type AdminSearchResponse = Response<AdminGetResponse | MessageResponse>;

// delete user
export type AdminDeleteRequest = Request<AdminDeleteParams, MessageResponse>;
export type AdminDeleteResponse = Response<MessageResponse>;

// login as user
export type AdminLoginAsUserRequest = Request<AdminLoginAsUserParams, AdminLoginAsUserResponse>;
export type AdminLoginAsUserResponse = Response<AdminLoginAsUserResponse | MessageResponse>;