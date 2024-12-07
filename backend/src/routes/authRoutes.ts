import express, { Request, Response } from 'express';
import authController from '../controller/authController';

const authRouter = express.Router();

// Define routes and associate them with controller methods
authRouter.post('/register', async (req: Request, res: Response) => await authController.register(req, res));
authRouter.post('/login', async (req: Request, res: Response) => await authController.login(req, res));
authRouter.delete('/logout', async (req: Request, res: Response) => await authController.logout(req, res));

export default authRouter;
