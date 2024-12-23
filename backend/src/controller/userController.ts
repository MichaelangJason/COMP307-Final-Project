import bcrypt from "bcrypt";
import { User } from "@shared/types/db/user";
import { ObjectId } from "mongodb";
import { getCollection } from "../utils/db";
import { CollectionNames } from "./constants";
import { UserBasicInfo } from "@shared/types/api/admin";
import { UserGetRequest, UserGetRequestsRequest, UserGetRequestsResponse, UserGetResponse, UserUpdateRequest, UserUpdateResponse } from "./types/user";
import { AdminDeleteRequest, AdminDeleteResponse, AdminGetRequest, AdminGetResponse, AdminLoginAsUserRequest, AdminLoginAsUserResponse, AdminSearchRequest, AdminSearchResponse } from "./types/admin";
import { validatePassword } from "./authController";
import { isAllowed, updateUpcomingMeetings } from "./utils/user";
import { updateIfExpired } from "./utils/request";
import { Request } from "@shared/types/db";
import { formatDate } from "./utils/meeting";

// Get User Profile
const getProfile = async (req: UserGetRequest, res: UserGetResponse) => {

    if (!ObjectId.isValid(req.params.userId)) {
        res.status(400).json({ message: 'Invalid User ID format' });
        return;
    }

    if (!isAllowed(req.user?.role, req.params.userId, req.user?.userId)) {
        res.status(403).json({ message: 'You are not authorized to access this user' });
        return;
    }

    const userId = new ObjectId(req.params.userId);

    try {
        const user = await getUserById(userId);

        if (user) {
            if (!await updateUpcomingMeetings(user)) throw new Error('Failed to update upcoming meetings');
            res.status(200).json({
                id: user._id.toString(),
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                notifications: user.notifications,
                upcomingMeetings: user.upcomingMeetings,
                hostedMeetings: user.hostedMeetings.map((meeting) => meeting.toString()),
                requests: user.requests.map((request) => request.toString())
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
    if (!isAllowed(req.user?.role, req.params.userId, req.user?.userId)) {
        res.status(403).json({ message: 'You are not authorized to update this user' });
        return;
    }

    const userId = new ObjectId(req.params.userId);

    if (!req.body || Object.keys(req.body).length === 0) {
        res.status(400).json({ message: 'Nothing to update. Please fill the field you wish to update.' });
        return;
    }

    const { password, notifications } = req.body;
    const usersCollection = await getCollection<User>(CollectionNames.USER);

    try {
        const user = await getUserById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const updatedFields: Partial<User> = {};
        
        if (password) {
            const { isValid, message } = validatePassword(password);
            if (!isValid) {
                res.status(400).json({ message });
                return;
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            updatedFields.password = hashedPassword;
        }
        if (notifications) {
            updatedFields.notifications = notifications;
        }
        if (Object.keys(updatedFields).length === 0) {
            res.status(400).json({ message: 'Nothing to update. Please fill the field you wish to update.' });
            return;
        }
        
        updatedFields.updatedAt = new Date();
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

// Get Request
const getRequests = async (req: UserGetRequestsRequest, res: UserGetRequestsResponse) => {
    if (!ObjectId.isValid(req.params.userId)) {
        res.status(400).json({ message: 'Invalid User ID format' });
        return;
    }
    if (!isAllowed(req.user?.role, req.params.userId, req.user?.userId)) {
        res.status(403).json({ message: 'You are not authorized to access this user' });
        return;
    }

    const userId = new ObjectId(req.params.userId);

    let user: User | null = null;
    const usersCollection = await getCollection<User>(CollectionNames.USER);
    user = await usersCollection.findOne({ _id: userId } as any);
    if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
    }
    const requestIds = user.requests;

    const requestsCollection = await getCollection<Request>(CollectionNames.REQUEST);
    let requests = await requestsCollection.find({ _id: { $in: requestIds } } as any).toArray();

    requests = requests.map((request) => ({
        ...request,
        requestId: request._id.toString()
    }));
    for (const request of requests) {
        await updateIfExpired(request as Request);
    }

    res.status(200).json({ requests });
}

// **Admin Endpoints**

const getAllUsers = async (req: AdminGetRequest, res: AdminGetResponse): Promise<void> => {
    try {
        const usersCollection = await getCollection<User>(CollectionNames.USER);
        const users = await usersCollection.find({ role: { $ne: 0 } }).toArray();
        const userCount = await usersCollection.countDocuments();
        console.log("GetAllUsers", users, "totalUsers:", userCount)

        const usersBasicInfo: UserBasicInfo[] = users.map(user => ({
            id: user._id.toString(),
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            createdAt: formatDate(user.createdAt)
        }));

        res.json({ totalUsers: userCount, users: usersBasicInfo });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error });
    }
};

// Get users by searching userId, firstName, lastName, or email
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

        const query: any = {
            $or: [
                { firstName: { $regex: search as string, $options: "i" } },
                { lastName: { $regex: search as string, $options: "i" } },
                { email: { $regex: search as string, $options: "i" } },
            ],
            role: { $ne: 0 }
        };

        if (ObjectId.isValid(search)) {
            query.$or.push({ _id: new ObjectId(search) });
        }

        const usersCollection = await getCollection<User>(CollectionNames.USER);
        const users = await usersCollection.find(query).toArray();
        const userCount = await usersCollection.countDocuments(query);

        const usersBasicInfo: UserBasicInfo[] = users.map(user => ({
            id: user._id.toString(),
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            createdAt: formatDate(user.createdAt)
        }));

        console.log("QueryUsersBySearch", users, "totalUsers:", userCount)

        res.status(200).json({ totalUsers: userCount, users: usersBasicInfo });
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
    getRequests
};