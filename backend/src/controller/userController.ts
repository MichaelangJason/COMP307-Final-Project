import bcrypt from "bcrypt";
import { User } from "@shared/types/db/user";
import { ObjectId } from "mongodb";
import { getCollection } from "../utils/db";
import { CollectionNames } from "./constants";
import { UserBasicInfo } from "@shared/types/api/admin";
import { UserGetRequest, UserGetResponse, UserUpdateRequest, UserUpdateResponse } from "./types/user";
import { AdminDeleteRequest, AdminDeleteResponse, AdminGetRequest, AdminGetResponse, AdminLoginAsUserRequest, AdminLoginAsUserResponse, AdminSearchRequest, AdminSearchResponse } from "./types/admin";

// Get User Profile
const getProfile = async (req: UserGetRequest, res: UserGetResponse) => {

    if (!ObjectId.isValid(req.params.userId)) {
        res.status(400).json({ message: 'Invalid User ID format' });
        return;
    }

    const userId = new ObjectId(req.params.userId);
    console.log("userId", userId);

    try {
        const user = await getUserById(userId);
        console.log("user", user);
        if (user) {
            res.status(200).json({
                id: user._id.toString(),
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                notifications: user.notifications,
                upcomingMeetings: user.upcomingMeetings,
                hostedMeetings: user.hostedMeetings,
                requests: user.requests
                // filter out fields only used for backend
            });
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
const updateProfile = async (req: UserUpdateRequest, res: UserUpdateResponse) => {
    if (!ObjectId.isValid(req.params.userId)) {
        res.status(400).json({ message: 'Invalid User ID format' });
        return;
    }

    const userId = new ObjectId(req.params.userId);
    console.log("userId", userId);
    const { password } = req.body;
    const usersCollection = await getCollection<User>(CollectionNames.USER);

    try {
        const user = await getUserById(userId);
        console.log("user", user);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const updatedFields: Partial<User> = { ...req.body };
        updatedFields.updatedAt = new Date();

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

const getAllUsers = async (req: AdminGetRequest, res: AdminGetResponse): Promise<void> => {
    try {
        const usersCollection = await getCollection<User>(CollectionNames.USER);
        const users = await usersCollection.find().toArray();
        const userCount = await usersCollection.countDocuments();
        console.log("GetAllUsers", users, "totalUsers:", userCount)

        const usersBasicInfo: UserBasicInfo[] = users.map(user => ({
            id: user._id.toString(),
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
        }));
    
        res.json({ totalUsers: userCount, users: usersBasicInfo });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error });
    }
};

// Get users by searching firstName, lastName, or email
const getUsers = async (req: AdminSearchRequest, res: AdminSearchResponse) => {
    try {
        const { search } = req.query;

        if (search === undefined || typeof search !== 'string') {
            res.status(400).json({ message: 'Invalid search query' });
            return;
        }
        if (search.length === 0) {
            res.status(200).json({ totalUsers: 0, users: [] });
            return;
        }

        const query = {
                $or: [
                    { firstName: { $regex: search as string, $options: "i" } },
                    { lastName: { $regex: search as string, $options: "i" } },
                    { email: { $regex: search as string, $options: "i" } }
                ]
            };
        const usersCollection = await getCollection<User>(CollectionNames.USER);
        const users = await usersCollection.find(query).toArray();
        const userCount = await usersCollection.countDocuments(query);
        
        const usersBasicInfo: UserBasicInfo[] = users.map(user => ({
            id: user._id.toString(),
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
        }));

        console.log("QueryUsersBySearch", users, "totalUsers:", userCount)

        res.status(200).json({totalUsers: userCount, users: usersBasicInfo});
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch users", error });
    }
};

const deleteUser = async (req: AdminDeleteRequest, res: AdminDeleteResponse) => {
    if (!ObjectId.isValid(req.params.userId)) {
        res.status(400).json({ message: 'Invalid User ID format' });
        return;
    }
    const userId = new ObjectId(req.params.userId);
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

const loginAsUser = async (req: AdminLoginAsUserRequest, res: AdminLoginAsUserResponse) => {
    if (!ObjectId.isValid(req.params.userId)) {
        res.status(400).json({ message: 'Invalid User ID format' });
        return;
    }
    
    const userId = new ObjectId(req.params.userId);

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