import express, { Request, Response, NextFunction } from 'express';
import userController from '../controller/userController';
import adminMiddleware from '../middleware/adminMiddleware';
import privateMiddleware from '../middleware/privateMiddleware';

const userRouter = express.Router();

//Profile
userRouter.get('/profile/:id', privateMiddleware, userController.getProfile);
userRouter.put('/profile/:id', privateMiddleware, userController.updateProfile);

// Admin
userRouter.get('/admin/members', adminMiddleware, userController.getAllUsers);
userRouter.get('/admin/members/search', adminMiddleware, userController.getUsers);
userRouter.put('/admin/members/:id', adminMiddleware, userController.updateProfile);
userRouter.delete('/admin/members/:id', adminMiddleware, userController.deleteUser);
userRouter.post('/admin/members/:id/login-as', adminMiddleware, userController.loginAsUser);


export default userRouter;
