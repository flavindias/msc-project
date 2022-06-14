import axios from 'axios';
import dotenv from 'dotenv';
import { Request, Response } from 'express';
dotenv.config();

export const AuthController = {
    async spotify(req: Request, res: Response) {
        try{
            const { token } = req.body;
            const response = await axios.get(`https://api.spotify.com/v1/me`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return res.status(200).json(response.data);
        }
        catch(err){
            console.log(err);
            return res.status(500).json({
                message: 'Error while trying to authenticate with Spotify'
            });
        }
    },
    async deezer(req: Request, res: Response) {
        try{
            const { token } = req.body;
            const response = await axios.get(`https://api.deezer.com/user/me`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return res.status(200).json(response.data);
        }
        catch(err){
            console.log(err);
            return res.status(500).json({
                message: 'Error while trying to authenticate with Deezer'
            });
        }
    }
}