import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "@shared/types/db/user";
import { ObjectId } from "mongodb";
import { getCollection, getDocument } from "../utils/db";
import { CollectionNames } from "./constants";
// Get User Profile
const getProfile = async (req: Request, res: Response): Promise<void> => {
    const userId = new ObjectId(req.params.id);
    console.log("userId", userId);
    try {
        if (!ObjectId.isValid(userId)) {
            res.status(400).json({ message: 'Invalid User ID format' });
            return;
        }
        const user = await getUserById(userId);
        console.log("user", user);
        if (user) {
            res.json(user);
            return;
        }
        res.status(404).json({ message: 'User not found' });
        return;
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error });
        return;
    }
};

// Update User Profile
const updateProfile = async (req: Request, res: Response): Promise<void> => {
    const userId = new ObjectId(req.params.id);
    console.log("userId", userId);
    const { firstName, lastName, email, password } = req.body;
    const usersCollection = await getCollection<User>(CollectionNames.USER);
    try {
        const user = await getUserById(userId);
        console.log("user", user);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const updatedFields: Partial<User> = { ...req.body};

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updatedFields.password = hashedPassword;
        }

        const result = await usersCollection.updateOne(
            { _id: userId } as any,
            { $set: updatedFields }
        );

        if (result.modifiedCount > 0) {
            const updatedUser = await getUserById(userId);
            console.log(updatedUser);
            if (updatedUser) {
                res.status(200).json({
                    message: "User updated successfully",
                    name: updatedUser.firstName + " " + updatedUser.lastName
                });
            }

        } else {
            res.status(400).json({ message: 'No changes made to the profile' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error });
    }
};

// **Admin Endpoints**

const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const usersCollection = await getCollection<User>(CollectionNames.USER);
        const users = await usersCollection.find().toArray();
        const userCount = await usersCollection.countDocuments();
        console.log("GetAllUsers", users, "totalUsers:", userCount)
        res.json({totalUsers: userCount, users});
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error });
    }
};

// Get users by searching firstName, lastName, or email
const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const { search } = req.query;
        const query = search
            ? {
                $or: [
                    { firstName: { $regex: search as string, $options: "i" } },
                    { lastName: { $regex: search as string, $options: "i" } },
                    { email: { $regex: search as string, $options: "i" } }
                ]
            }
            : {};
        const usersCollection = await getCollection<User>(CollectionNames.USER);
        const users = await usersCollection.find(query).toArray();
        const userCount = await usersCollection.countDocuments(query);
        console.log("QueryUsersBySearch", users, "totalUsers:", userCount)
        res.status(200).json({totalUsers: userCount, users});
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch users", error });
    }
};

// // Update User Profile as Admin
// const updateUserAsAdmin = async (req: Request, res: Response): Promise<void> => {
//     const userId = new ObjectId(req.params.id);
//     const { firstName, lastName, email, role } = req.body;

//     try {
//         const usersCollection = await getCollection<User>(CollectionNames.USER);
//         const user = await getUserById(userId);
//         if (!user) {
//             res.status(404).json({ message: "User not found" });
//             return;
//         }

//         const updatedFields: Partial<User> = {
//             firstName: firstName || user.firstName,
//             lastName: lastName || user.lastName,
//             email: email || user.email,
//             role: role ?? user.role, // Allow admins to update the user's role
//         };

//         const result = await usersCollection.updateOne(
//             { _id: userId } as any,
//             { $set: updatedFields }
//         );

//         if (result.modifiedCount > 0) {
//             const updatedUser = await getUserById(userId);
//             console.log(updatedUser);
//             if (updatedUser) {
//                 res.status(200).json({
//                     message: "User updated successfully",
//                     name: updatedUser.firstName + " " + updatedUser.lastName
//                 });
//             }
//         } else {
//             res.status(400).json({ message: "No changes made to the profile" });
//         }
//     } catch (error) {
//         res.status(500).json({ message: "Internal Server Error", error });
//     }
// };

const deleteUser = async (req: Request, res: Response): Promise<void> => {
    const userId = new ObjectId(req.params.id);
    const usersCollection = await getCollection<User>(CollectionNames.USER);

    try {
        const user = await getUserById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        await usersCollection.deleteOne({ _id: userId } as any);
        console.log("Succesfully deleted user", user.email);
        res.status(204).send(); // No content, successful deletion
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error });
    }
};

const loginAsUser = async (req: Request, res: Response): Promise<void> => {
    const userId = new ObjectId(req.params.id);

    try {
        const user = await getUserById(userId);
        if (user) {
            res.json({
                message: `Logged in as ${user.firstName} ${user.lastName}`, user
            });
            console.log(`Logged in as ${user.firstName} ${user.lastName}`, user)
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error });
    }
};

const getUserById = async (userId: ObjectId): Promise<User | null> => {
    const usersCollection = await getCollection<User>(CollectionNames.USER);
    return await usersCollection.findOne({ _id: userId } as any);
};

export default {
    getProfile,
    updateProfile,
    getAllUsers,
    getUsers,
    //updateUserAsAdmin,
    deleteUser,
    loginAsUser,
};