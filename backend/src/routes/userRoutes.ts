import express, { Request, Response } from 'express';
import * as userController from '../controller/userController';

const router = express.Router();

// Define routes and associate them with controller methods
router.post('/register', (req: Request, res: Response) => userController.register(req, res));
router.post('/login', (req: Request, res: Response) => userController.login(req, res));
router.delete('/logout', (req: Request, res: Response) => userController.logout(req, res));

export default router;
