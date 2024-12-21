// YuTong Wei
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

// Private middleware validate authentication for private pages
export const privateMiddleware = async <T>(req: Request<T>, res: Response, next: NextFunction) => {
    
    if (Number(process.env.BYPASS_AUTH)) {
        console.log("Bypassing authentication");
        next();
        return;
    }

    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token || !req.headers.authorization?.startsWith("Bearer ")) {
            res.status(401).json({ message: "Correct authentication token is required" });
            return;
        }

        const decoded: any = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        console.log("Authenticated User:", decoded);
    
        next()
    } catch (error) {
        res.status(403).json({ message: "Invalid or expired token", error });
        return;
    }
};

export default privateMiddleware;
