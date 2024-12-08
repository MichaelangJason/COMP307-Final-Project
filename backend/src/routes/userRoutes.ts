import express, { Request, Response } from 'express';
import userController from '../controller/userController';

const userRouter = express.Router();

//Profile
userRouter.get('/profile/:id', async (req: Request, res: Response) => await userController.getProfile(req, res));
userRouter.put('/profile/:id', async (req: Request, res: Response) => await userController.updateProfile(req, res));
//Admin
userRouter.get('/admin/members', userController.getAllUsers);
userRouter.delete('/admin/members/:id', userController.deleteUser);
userRouter.post('/admin/members/:id/login-as', userController.loginAsUser);


export default userRouter;
