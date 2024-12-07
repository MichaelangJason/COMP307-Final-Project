import express, { Request, Response } from 'express';
import userController from '../controller/userController';

const userRouter = express.Router();

// Define routes and associate them with controller methods
userRouter.get('/profile', async (req: Request, res: Response) => await userController.getProfile(req, res));
userRouter.put('/profile', async (req: Request, res: Response) => await userController.updateProfile(req, res));

export default userRouter;
