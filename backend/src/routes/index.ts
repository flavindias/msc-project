import { Router, Response } from 'express';
import { checkUser, checkAdmin } from '../middlewares/acl';
import { AuthController } from '../controller/auth';
import { RoomController } from '../controller/room';
import { TrackController } from '../controller/track';
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
    router.post('/rooms/:id/join', checkUser(), RoomController.join);
    router.post('/rooms/:id/track', checkUser(), RoomController.addTrack);
    router.get('/deezer/recommendation', checkUser(), DeezerController.getRecommendation);
    router.post('/deezer/isrc/:isrc', checkUser(), DeezerController.getSongInfoISRC);
    router.post('/spotify/sync', checkUser(), SpotifyController.syncTrack);
    router.get('/tracks', checkUser(), TrackController.list);
    router.post('/tracks/:trackId/vote', checkUser(), TrackController.vote);
    return router;
};