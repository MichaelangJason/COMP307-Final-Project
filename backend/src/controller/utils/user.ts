import { UserRole } from "../../utils/statusEnum";

export const isAllowed = (role: UserRole, paramsID: any, userID: any) => {
  return  role == UserRole.ADMIN || 
    Number(process.env.BYPASS_AUTH) ||
    paramsID == userID;
}
