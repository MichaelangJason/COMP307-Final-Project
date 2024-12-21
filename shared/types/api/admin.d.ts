import { ObjectId } from "../../../backend/node_modules/mongodb";
import { User } from "../db";

// common
export interface MessageResponse {
    message: string;
    error?: any;
    name?: string;
}
export interface UserBasicInfo {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    createdAt: string;
}

/**
 * Applied API:
 * GET - /admin/members
 */
export interface AdminGetResponse {
    totalUsers: number;
    users: UserBasicInfo[]; // admin gets everything
}
export interface AdminGetQuery {
  search: string;
}

// delete user
export interface AdminDeleteParams {
    userId: string;
}

// login as user
export interface AdminLoginAsUserParams {
    userId: string;
}
export interface AdminLoginAsUserResponse {
  message: string;
  user: User;
}