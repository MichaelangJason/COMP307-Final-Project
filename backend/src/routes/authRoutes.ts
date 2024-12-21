// YuTong Wei
import express, { Request, Response } from 'express';
import authController from '../controller/authController';
import { privateMiddleware } from '../middleware/privateMiddleware';

const authRouter = express.Router();

// Define routes and associate them with controller methods
authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);
authRouter.get('/login', privateMiddleware, authController.loginGet);
authRouter.delete('/logout', authController.logout);

export default authRouter;
