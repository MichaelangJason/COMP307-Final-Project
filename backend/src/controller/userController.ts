import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "@shared/types/db/user";
import { ObjectId } from "mongodb";
import { getCollection } from "../utils/db";

import { CollectionNames } from "./constants";
// Get User Profile
const getProfile = async (req: Request, res: Response): Promise<void> => {
    res.status(200).json({ message: "Successfully get user profile" });
};

// Update User Profile
const updateProfile = async (req: Request, res: Response): Promise<void> => {
    res.status(200).json({ message: "Profile updated successfully" });
};

export default { getProfile, updateProfile };