import express, { Request, Response } from 'express';
import userController from '../controller/userController';

const userRouter = express.Router();

//Profile
userRouter.get('/profile/:id', userController.getProfile);
userRouter.put('/profile/:id', userController.updateProfile);
//Admin
userRouter.get('/admin/members', userController.getAllUsers);
userRouter.put('/admin/members/:id', userController.updateUserAsAdmin);
userRouter.delete('/admin/members/:id', userController.deleteUser);
userRouter.post('/admin/members/:id/login-as', userController.loginAsUser);
//TODO: add adminMiddleware to validate user.role


export default userRouter;
