import express from 'express';
import userController from '../controller/userController';
import adminMiddleware from '../middleware/adminMiddleware';
import privateMiddleware from '../middleware/privateMiddleware';
import { UserParams } from '@shared/types/api/user';

const userRouter = express.Router();

//Profile
userRouter.get('/profile/:userId', privateMiddleware<UserParams>, userController.getProfile);
userRouter.put('/profile/:userId', privateMiddleware<UserParams>, userController.updateProfile);

// // Admin
userRouter.get('/admin/members', adminMiddleware<{}>, userController.getAllUsers);
userRouter.get('/admin/members/search', adminMiddleware, userController.getUsers as any);
userRouter.put('/admin/members/:userId', adminMiddleware<UserParams>, userController.updateProfile);
userRouter.delete('/admin/members/:userId', adminMiddleware<UserParams>, userController.deleteUser);
userRouter.post('/admin/members/:userId/login-as', adminMiddleware<UserParams>, userController.loginAsUser);


export default userRouter;
