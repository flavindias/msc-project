import axios from "axios";
import dotenv from "dotenv";
import { Partitioners } from "kafkajs";
import { PrismaClient } from "@prisma/client";
import { KafkaConnection } from "./kafka";
import db from "./mongo";
dotenv.config();

const prisma = new PrismaClient();
const kafka = KafkaConnection.getKafka();
const spotifyConsumer = kafka.consumer({ groupId: `spotify-group` });
const spotifyProducer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner,
});

export const getTrackInfo = async () => {
  try {
    console.log("getTrackInfo");
    const data = await axios.get(`https://api.spotify.com/v1/me/top/tracks`);
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
    console.log(trackInfo, "getTrackByISRC");
    if(trackInfo) {

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
        Promise.all(tracks.map(async (track) => {
          await getTrackByISRC(track.isrc, user.token);
        }));
        // const isrc = tracks.map((track) => track.isrc)[0];
        // if (isrc) {
        //   await getTrackByISRC(isrc, user.token);
        // }
        console.log(tracks.map((track) => track.isrc)[0], "tracks");
      }
    }, 30000);
    // await spotifyConsumer.connect();
    // await spotifyConsumer.subscribe({
    //   topic: "spotify-new-track",
    // });
    // await spotifyConsumer.run({
    //   eachMessage: async ({ topic, message }) => {
    //     try {
    //       const user = await db.collection("spotifyTokens").findOne();
    //       console.log(user, "spotifyConsumer");
    //       if(user) {
    //         const msg = message.value && JSON.parse(message.value.toString());
    //         const tracks = getTrackByISRC(msg.isrc, user.token);
    //       }
    //       else {
    //         throw new Error("No user found");
    //       }
    //     } catch (e) {
    //       console.log("???????");
    //       console.log(e, "catch.run");
    //       if (e instanceof Error) {
    //         console.log("!!!!!!!!");
    //         spotifyConsumer.pause([{ topic }]);
    //         setTimeout(() => spotifyConsumer.resume([{ topic }]), 1000);
    //       }
    //     }
    //   },
    // });
  } catch (error) {
    console.log("?!?!?!?!?!?!");
    console.log(error, "run");
  }
};

interface NoTokenStoredError extends Error {
  message: string;
  retryAfter: number;
}
