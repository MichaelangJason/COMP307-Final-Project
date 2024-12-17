import { MessageResponse, UserRole } from "./common";

// register
export interface RegisterBody {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}
export interface RegisterResponse extends MessageResponse {}

// Login
export interface LoginBody {
  email: string;
  password: string;
}
export interface LoginResponse extends MessageResponse {
  token: string;
  userId: string;
  role: UserRole;
}

// Verify Login Status
export interface VerifyResponse {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}
