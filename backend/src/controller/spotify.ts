import axios from "axios";
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { RequestCustom } from "../types/requestCustom";
import { getTrackByISRC } from "../middlewares/spotify";

const prisma = new PrismaClient();

export const SpotifyController = {
  async syncTrack(expressRequest: Request, res: Response) {
    try {
      const req = expressRequest as RequestCustom;
      const user = req.user;
      if (!user) throw new Error("User not found");

      const { isrc, token } = req.body;
      const searchTrack = await prisma.track.findUnique({
        where: {
          isrc,
        },
      });
      console.log(searchTrack, "searchTrack");
      if(!searchTrack) {
        const track = await getTrackByISRC(isrc, token);
        if (track) {
            await prisma.userTracks.create({
                data: {
                  user: {
                    connect: {
                      id: user.id,
                    },
                  },
                  track: {
                    connect: {
                      id: track.id,
                    },
                  },
                },
              });
        }
        else{
          throw new Error("Track not found");
        }
      }
      else{
        const userTrack = await prisma.userTracks.findFirst({
          where: {
            userId: user.id,
            trackId: searchTrack.id,
          },
        });
        if(!userTrack) {
          await prisma.userTracks.create({
            data: {
              userId: user.id,
              trackId: `${searchTrack.id}`,
            },
          });
        }
      }
      
      return res.status(200).json({
        message: "Successfully synced track",
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Error syncing track",
        error: err,
      });
    }
  },
};
