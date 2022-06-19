import { Router, Response } from 'express';
import { AuthController } from '../controller/auth';
const router = Router();

export const deejaiRoutes = () => {
    router.get('/', (_, res: Response) => res.status(418).json({ message: 'Deej.ai API' }));  
    router.post('/auth/spotify', AuthController.spotify);
    router.post('/auth/deezer', AuthController.deezer);
    router.post('/auth/login', AuthController.login);
    return router;
};