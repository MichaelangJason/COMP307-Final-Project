import { LoginBody, LoginResponse, RegisterBody, VerifyResponse } from "@shared/types/api/auth";
import { MessageResponse } from "@shared/types/api/common";
import { Request, Response } from "express";

export type LoginRequest = Request<{}, LoginResponse, LoginBody>;
export type LoginResponse = Response<LoginResponse | MessageResponse>;

export type RegisterRequest = Request<{}, RegisterResponse, RegisterBody>;
export type RegisterResponse = Response<RegisterResponse | MessageResponse>;

export type VerifyRequest = Request<{}, VerifyResponse>;
export type VerifyResponse = Response<VerifyResponse | MessageResponse>;

export type LogoutRequest = Request<{}, MessageResponse>;
export type LogoutResponse = Response<MessageResponse>;