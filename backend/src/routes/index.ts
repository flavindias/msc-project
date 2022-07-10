import { Router, Response } from 'express';
import { checkUser, checkAdmin } from '../middlewares/acl';
import { AuthController } from '../controller/auth';
import { RoomController } from '../controller/room';
const router = Router();

export const deejaiRoutes = () => {
    router.get('/', (_, res: Response) => res.status(418).json({ message: 'Deej.ai API' }));  
    router.post('/auth/spotify', AuthController.spotify);
    router.post('/auth/deezer', AuthController.deezer);
    router.post('/auth/login', AuthController.login);
    router.get('/rooms', checkUser(), checkAdmin(false), RoomController.list);
    router.get('/rooms/:id', RoomController.get);
    router.post('/rooms', RoomController.create);
    router.post('/rooms/:id/join', RoomController.join);
    return router;
};