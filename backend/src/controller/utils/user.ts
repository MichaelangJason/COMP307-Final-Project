import { UserRole } from "../../utils/statusEnum";

export const isAllowed = (role: UserRole, paramsID: any, userID: any) => {
  return Number(process.env.DEV_MODE) || 
    role == UserRole.ADMIN || 
    paramsID == userID;
}