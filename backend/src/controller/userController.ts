import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "@shared/types/db/user"; 
import { ObjectId } from "mongodb";
import { getCollection } from "../utils/db";

import { CollectionNames } from "./constants";

const JWT_SECRET = process.env.JWT_SECRET!;

// Register API - Check for existing user records in the database and save the new user record
const register = async (req: Request, res: Response): Promise<void> => {
  const usersCollection = await getCollection<User>(CollectionNames.USERS_COLLECTION);
  const { email, password, firstName, lastName } = req.body;

  if (!email || !password || !firstName || !lastName) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  if (!email.endsWith("@mail.mcgill.ca")) {
    res.status(400).json({ message: "Invalid email domain" });
    return;
  }

  try {
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser: User = {
      _id: new ObjectId(),
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: 0,
      notifications: {
        email: true,
        sms: false,
        alarm: 0,
      },
      upcomingMeetings: [],
      hostedMeetings: [],
      requests: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await usersCollection.insertOne(newUser);
    res.status(201).json({ message: "User registered successfully" });
    console.log("User registered successfully",(newUser._id))
  } catch (error) {
    res.status(500).json({ message: "Registration failed"});
    console.log("Registration failed", error)
  }
};

// Login API -  Validate user credentials against the database and return session token
const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  const usersCollection = await getCollection<User>(CollectionNames.USERS_COLLECTION);

  if (!email || !password) {
    res.status(400).json({ message: "Email and password are required" });
    return;
  }

  try {
    const user = await usersCollection.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ token, message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error });
  }
};

// Logout API - Clear the session token
const logout = (req: Request, res: Response): void => {
  res.clearCookie("token"); 
  res.status(200).json({ message: "Logout successful" });
};

export default { register, login, logout };