import { Router } from 'express';
import requestController from '../controller/requestController';

const requestRouter = Router();

// ping
requestRouter.get('/ping', requestController.ping);

// update request
// requestRouter.put('/:id', requestController.update);

// get request info by id
requestRouter.get('/:id', requestController.getInfo);


export default requestRouter;
