import axios from "axios";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import db from "./mongo";
dotenv.config();

const prisma = new PrismaClient();

export const getTopTracks = async (token: string, userId: string) => {
  try {
    const data = await axios.get(`https://api.spotify.com/v1/me/top/tracks`, 
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        limit: 50,
        offset: 0,
      },
    });
    console.log(data.data);
  } catch (error) {
    console.log(error);
  }
};

export const getTrackByISRC = async (isrc: string, token: string) => {
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/search?type=track&q=isrc:${isrc}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const trackInfo = response.data.tracks.items[0];
    if (trackInfo) {
      const track = await prisma.track.findUnique({
        where: {
          isrc,
        },
        include: {
          spotify: true,
        },
      });
      if (track && !track.spotify) {
        await prisma.spotifyTrack.create({
          data: {
            trackId: track.id,
            spotifyId: trackInfo.id,
            href: `${trackInfo.href}`,
            isLocal: trackInfo.is_local,
            popularity: trackInfo.popularity,
            previewUrl: `${trackInfo.preview_url}`,
            uri: trackInfo.uri,
          },
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

export const run = async () => {
  try {
    setInterval(async () => {
      const user = await db.collection("spotifyTokens").findOne();
      if (user) {
        const tracks = await prisma.track.findMany({
          where: {
            spotify: null,
          },
          include: {
            spotify: true,
          },
        });
        Promise.all(
          tracks.map(async (track) => {
            await getTrackByISRC(track.isrc, user.token);
          })
        );
      }
    }, 30000);
  } catch (error) {
    console.error(error);
  }
};
