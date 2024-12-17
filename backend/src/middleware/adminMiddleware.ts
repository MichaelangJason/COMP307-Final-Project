import { Request, Response, NextFunction } from "express";
import { User } from "@shared/types/db/user";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getCollection } from "../utils/db";
import { CollectionNames } from "../controller/constants";

const JWT_SECRET = process.env.JWT_SECRET!;

// Admin middleware to check user's role
export const adminMiddleware = async <T>(req: Request<T>, res: Response, next: NextFunction): Promise<void>  => {
    if (Number(process.env.BYPASS_AUTH)) {
        console.log("Bypassing admin middleware");
        next();
        return;
    }

    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            res.status(401).json({ message: "Authentication token is required" });
            return;
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        console.log("decoded", decoded);
        if (typeof decoded === 'string') {
            res.status(401).json({ message: "Invalid token" });
            return;
        }

        const usersCollection = await getCollection<User>(CollectionNames.USER);
        const user = await usersCollection.findOne({ _id: new ObjectId(decoded.userId as string) } as any);
        console.log("Admin user", user);
        
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
