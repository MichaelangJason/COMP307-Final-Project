import express, { Request, Response } from 'express';
import userController from '../controller/userController';

const userRouter = express.Router();

// Define routes and associate them with controller methods
userRouter.post('/register', async (req: Request, res: Response) => await userController.register(req, res));
userRouter.post('/login', async (req: Request, res: Response) => await userController.login(req, res));
userRouter.delete('/logout', async (req: Request, res: Response) => await userController.logout(req, res));

export default userRouter;
