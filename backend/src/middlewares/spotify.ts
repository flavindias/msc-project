import axios from "axios";
import dotenv from "dotenv";
import { Partitioners } from "kafkajs";
import { KafkaConnection } from "./kafka";
import db from "./mongo";
dotenv.config();

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
export const getArtistInfo = () => {
  console.log("getArtistInfo");
};
export const getAudioFeatures = () => {
  console.log("getAudioFeatures");
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
    console.log( response.data);
  } catch (error) {
    console.log(error);
  }
};

export const run = async () => {
  try {
    await spotifyConsumer.connect();
    await spotifyConsumer.subscribe({
      topic: "spotify-new-track",
    });
    await spotifyConsumer.run({
      eachMessage: async ({ topic, message }) => {
        try {
          const user = await db.collection("spotifyTokens").findOne();
          if(user) {
            const msg = message.value && JSON.parse(message.value.toString());
            const tracks = getTrackByISRC(msg.isrc, user.token);
            console.log(tracks, "spotifyConsumer");
          }
          else {
            throw new Error("No user found");
          }
        } catch (e) {
          if (e instanceof Error) {
            spotifyConsumer.pause([{ topic }]);
            setTimeout(() => spotifyConsumer.resume([{ topic }]), 1000);
          }
        }
      },
    });
  } catch (error) {
    console.log(error);
  }
};

interface NoTokenStoredError extends Error {
  message: string;
  retryAfter: number;
}