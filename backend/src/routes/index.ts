import { Router, Response } from 'express';
import { checkUser, checkAdmin } from '../middlewares/acl';
import { AuthController } from '../controller/auth';
import { RoomController } from '../controller/room';
import { DeezerController } from '../controller/deezer';
import { SpotifyController } from '../controller/spotify';
const router = Router();

export const deejaiRoutes = () => {
    router.get('/', (_, res: Response) => res.status(418).json({ message: 'Deej.ai API' }));  
    router.post('/auth/spotify', AuthController.spotify);
    router.post('/auth/deezer', AuthController.deezer);
    router.post('/auth/login', AuthController.login);
    router.get('/auth/me', checkUser(), AuthController.me);
    router.get('/rooms', checkUser(), checkAdmin(false), RoomController.list);
    router.get('/rooms/:id', checkUser(), RoomController.get);
    router.post('/rooms', checkUser(), RoomController.create);
    router.post('/rooms/:id/join', RoomController.join);
    router.get('/deezer/recommendation', checkUser(), DeezerController.getRecommendation);
    router.post('/spotify/sync', checkUser(), SpotifyController.syncTrack);
    return router;
};