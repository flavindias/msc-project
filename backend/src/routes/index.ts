import { Router, Response } from 'express';

const router = Router();

export const deejaiRoutes = () => {
    router.get('/', (_, res: Response) => res.status(413).json({ message: 'Deej.ai API' }));  
    return router;
};