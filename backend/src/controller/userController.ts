import { Request, Response } from 'express';

// Register API - Check for existing user records in the database and save the new user record
export const register = (req: Request, res: Response): void => {
  res.status(200).json({ message: "User registered" });
};

// Login API -  Validate user credentials against the database and return session token 
export const login = (req: Request, res: Response): void => {

  res.status(200).json({ message: "User logged in" });
};

// Logout API - Clear the session token
export const logout = (req: Request, res: Response): void => {
  res.status(200).json({ message: "User logged out" });
};
