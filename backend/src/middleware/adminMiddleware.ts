import { Request, Response, NextFunction } from "express";
import { User } from "@shared/types/db/user";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getCollection } from "../utils/db";
import { CollectionNames } from "../controller/constants";

const JWT_SECRET = "blue-bacon-stole-jamies-key";

// Admin middleware to check user's role
// const adminMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
//     try {
//         if (!req.user) {
//             res.status(401).send("Unauthorized");
//         } else {
//             console.log("req.user.id", req.user._id);
//             const userId = new ObjectId(req.user._id);
//             const usersCollection = await getCollection<User>(CollectionNames.USER);
//             const user = await usersCollection.findOne({ _id: userId } as any);
//             console.log("AdminUser", user);
//             if (!user) {
//                 res.status(404).json({ message: 'User not found' });
//             } else {
//                 if (user.role !== 0) {
//                     res.status(403).json({ message: 'Access denied' });
//                 }
//                 next();
//             }
//         }
//     } catch (error) {
//         res.status(500).json({ message: 'Internal Server Error', error });
//     }
// };

export const adminMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void>  => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            res.status(401).json({ message: "Authentication token is required" });
            return;
        }

        const decoded: any = jwt.verify(token, JWT_SECRET);
        console.log("decoded", decoded);

        const usersCollection = await getCollection<User>(CollectionNames.USER);
        const user = await usersCollection.findOne({ _id: new ObjectId(decoded.userId) } as any);
        console.log("user", user);
        
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        if (user.role !== 0) {
            res.status(403).json({ message: "Access forbidden: Admins only" });
            return;
        }

        next();
    } catch (error) {
        res.status(403).json({ message: "Invalid or expired token", error });
        return;
    }
};

export default adminMiddleware;
