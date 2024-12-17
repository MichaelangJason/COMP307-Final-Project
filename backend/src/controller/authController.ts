import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "@shared/types/db/user";
import { ObjectId } from "mongodb";
import { getCollection } from "../utils/db";
import { CollectionNames } from "./constants";
import { mcgillEmailRegex } from "../utils/regex";
import { RegisterRequest, RegisterResponse, LoginRequest, LoginResponse, VerifyRequest, VerifyResponse, LogoutRequest, LogoutResponse } from "./types/auth";
import { UserRole } from "../utils/statusEnum";

const JWT_SECRET = process.env.JWT_SECRET!;

// Register API - Check for existing user records in the database and save the new user record
const register = async (req: RegisterRequest, res: RegisterResponse): Promise<void> => {
  const usersCollection = await getCollection<User>(CollectionNames.USER);
  const { email, password, firstName, lastName } = req.body;

  if (!email?.trim() || !password?.trim() || !firstName?.trim() || !lastName?.trim()) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  if (!mcgillEmailRegex.test(email)) {
    res.status(400).json({ message: "Invalid McGill email" });
    return;
  }
  console.log("User Email:", email);

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    res.status(400).json({ message: passwordValidation.message });
    return;
  }


  try {
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("hashedPassword:", hashedPassword);

    const newUser: User = {
      _id: new ObjectId(),
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: UserRole.MEMBER,
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
    res.status(201).json({ message: "User registered successfully " + email });
    console.log("User registered successfully", (newUser._id.toString()))
  } catch (error) {
    res.status(500).json({ message: "Registration failed" });
    console.log("Registration failed", error)
  }
};

// Login API -  Validate user credentials against the database and return session token
const login = async (req: LoginRequest, res: LoginResponse): Promise<void> => {
  const { email, password } = req.body;
  const usersCollection = await getCollection<User>(CollectionNames.USER);

  if (!email?.trim() || !password?.trim()) {
    res.status(400).json({ message: "Email and password are required" });
    return;
  }

  try {
    const user = await usersCollection.findOne({ email });

    console.log("user:", user)
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign({ 
      userId: user._id, 
      email: user.email, 
      firstName: user.firstName, 
      lastName: user.lastName, 
      role: user.role 
    }, JWT_SECRET, { expiresIn: "1h" });

    console.log("Session token:", token)
    res.status(200).json({ 
      token, 
      userId: user._id.toString(), 
      role: user.role,
      message: "Login successful" 
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
    console.log("Login failed", error)
  }
};

// Login GET API - Check if the user is logged in
const loginGet = async (req: VerifyRequest, res: VerifyResponse): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: "User is not logged in" });
    return;
  }
  const { userId, email, firstName, lastName, role } = req.user;
  res.status(200).json({ userId, email, firstName, lastName, role, message: "User is logged in" });
};

// Logout API - Clear the session token
const logout = (req: LogoutRequest, res: LogoutResponse): void => {
  res.status(200).json({ message: "Logout successful" });
};

/**
 * Validates a password against specific complexity rules.
 * @param password - The password to validate.
 * @returns An object containing `isValid` and `message` with validation details.
 */
export function validatePassword(password: string): { isValid: boolean; message: string } {
  if (!password) {
    return { isValid: false, message: "Password cannot be empty." };
  }

  const lengthRegex = /^.{8,16}$/;
  const lowercaseRegex = /[a-z]/;
  const uppercaseRegex = /[A-Z]/;
  const digitRegex = /\d/;
  const symbolRegex = /[@$!%*?&#]/;

  if (!lengthRegex.test(password)) {
    return { isValid: false, message: "Password must be 8–16 characters long." };
  }
  if (!lowercaseRegex.test(password)) {
    return { isValid: false, message: "Password must contain at least 1 lowercase letter." };
  }
  if (!uppercaseRegex.test(password)) {
    return { isValid: false, message: "Password must contain at least 1 uppercase letter." };
  }
  if (!digitRegex.test(password)) {
    return { isValid: false, message: "Password must contain at least 1 digit." };
  }
  if (!symbolRegex.test(password)) {
    return { isValid: false, message: "Password must contain at least 1 special character." };
  }

  return { isValid: true, message: "Password is valid." };
}

export default { register, login, logout, loginGet };