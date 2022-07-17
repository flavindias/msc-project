import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { RequestCustom } from "../types/requestCustom";

const prisma = new PrismaClient();

export const TrackController = {
    async list(expressRequest: Request, res: Response) {
        const req = expressRequest as RequestCustom;
        // const { roomId } = req.query;
        try {
            const user = req.user;
            const userTracks = await prisma.userTracks.findMany({
                where: {
                    userId: user.id,
                },
                include: {
                    track: {
                        include: {
                            artist: true, 
                            contributors: true,
                            deezer: true,
                            spotify: true,
                        },
                    },
                },
            });
            res.json(userTracks);
        } catch (error) {
            console.error(error);
            res.status(500).json({
                error,
            });
        }
    },
    async vote(expressRequest: Request, res: Response) {
        try{
            const req = expressRequest as RequestCustom;
            const { trackId } = req.params;
            const { vote }  = req.body;
            const user = req.user;
            if (!user) throw new Error("User not found");
            if (!trackId) throw new Error("Track not found");
            const userTrack = await prisma.userTracks.findFirst({
                where: {
                    userId: user.id,
                    trackId,
                },
            });
            if (!userTrack) {
                await prisma.userTracks.create({
                    data: {
                        userId: user.id,
                        trackId, 
                        vote
                    },
                });
            }
            else{
                await prisma.userTracks.update({
                    where: {
                        id: userTrack.id,
                    },
                    data: {
                        vote
                    },
                });
            }
            res.json({
                message: "Vote saved",
            });
            
        }
        catch(error){
            console.error(error);
            res.status(500).json({
                error,
            });
        }
    }
}