import axios from "axios";
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { RequestCustom } from "../types/requestCustom";
import { RecommendationReturn, getTrackInfo } from "../middlewares/deezer";

const prisma = new PrismaClient();

export const DeezerController = {
    async getRecommendation(expressRequest: Request, res: Response) {
        try{
            const req = expressRequest as RequestCustom;
            const { access_token } = req.query;
            if(!access_token) throw new Error("Access token not found");
            const user = req.user
            if(!user) throw new Error("User not found")
            
            const response = await axios.get("https://api.deezer.com/user/me/recommendations/tracks", {
                params: {
                    access_token,
                },
            });
            console.log(response)
            const trackArr = response.data.data as RecommendationReturn[];
            console.log(trackArr, "trackArr")
            await Promise.all(
                trackArr.map(async (song) => {
                  const track = await getTrackInfo(`${song.id}`, `${access_token}`) as {
                    id: string
                    name: string,
                    isrc: string,
                    artistId: string,
                    createdAt: Date,
                    updatedAt: Date
                  };
                  const userTrack = await prisma.userTracks.findFirst({
                    where: {
                      userId: user.id,
                      trackId: track.id,
                    },
                  });
                  if(!userTrack) {
                    await prisma.userTracks.create({
                      data: {
                        userId: user.id,
                        trackId: `${track.id}`,
                      },
                    });
                  }
                  const newTrack = await prisma.track.findUnique({
                    where: {
                      isrc: track.isrc,
                    },
                    include: {
                      deezer: true,
                      spotify: true,
                    },
                  });
                })
              );
              return res.status(200).json({
                message: "Success",
            });
        }
        catch(err){
            console.log(err)
            return res.status(500).send(err);
        }
    }
}