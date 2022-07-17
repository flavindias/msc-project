import axios from "axios";
import db from "./mongo";
import dotenv from "dotenv";
import { Partitioners } from "kafkajs";
import { KafkaConnection } from "./kafka";
import { PrismaClient } from "@prisma/client";
dotenv.config();

const { DEEZER_APP_ID, DEEZER_APP_SECRET } = process.env;
const prisma = new PrismaClient();
const kafka = KafkaConnection.getKafka();
const deezerProducer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner,
});

const publish = async (topic: string, data: string): Promise<void> => {
  try {
    await deezerProducer.connect();
    await deezerProducer.send({
      topic: topic,
      messages: [{ value: data }],
    });

    await deezerProducer.disconnect();
  } catch (error) {
    console.error(error);
  }
}

export const getToken = async (code: string) => {
  try {
    const response = await axios.get(
      "https://connect.deezer.com/oauth/access_token.php",
      {
        params: {
          code,
          app_id: DEEZER_APP_ID,
          secret: DEEZER_APP_SECRET,
          output: "json",
        },
      }
    );
    return response.data.access_token;
  } catch (err) {
    console.error(err);
  }
};

export const getTracks = async (token: string) => {
  try {
    const response = await axios.get("https://api.deezer.com/user/me/tracks", {
      params: {
        access_token: token,
      },
    });
    return response.data.data;
  } catch (err) {
    console.error(err);
  }
};

export const getTrackInfo = async (id: string, accessToken: string) => {
  try {
    const response = await axios.get(`https://api.deezer.com/track/${id}`, {
      params: {
        access_token: accessToken,
      },
    });
    let artistId = "";
    const checkArtist = await prisma.deezerArtist.findUnique({
      where: {
        deezerId: response.data.artist.id,
      },
    });
    if (checkArtist) artistId = checkArtist.artistId;

    if (!checkArtist) {
      const checkArtistByName = await prisma.artist.findFirst({
        where: {
          name: response.data.artist.name,
        },
      });
      if (!checkArtistByName) {
        const newArtist = await prisma.artist.create({
          data: {
            name: response.data.artist.name,
            picture: response.data.artist.picture_xl,
            deezer: {
              create: {
                deezerId: response.data.artist.id,
                radio: response.data.artist.radio,
                link: response.data.artist.link,
                share: response.data.artist.share,
                tracklist: response.data.artist.tracklist,
              },
            },
          },
        });
        artistId = newArtist.id;
      } else {
        const newArtist = await prisma.artist.update({
          where: {
            id: checkArtistByName.id,
          },
          data: {
            picture: response.data.artist.picture_xl,
            deezer: {
              create: {
                deezerId: response.data.artist.id,
                radio: response.data.artist.radio,
                link: response.data.artist.link,
                share: response.data.artist.share,
                tracklist: response.data.artist.tracklist,
              },
            },
          },
        });
        artistId = newArtist.id;
      }
    }

    const track = await prisma.track.findUnique({
      where: {
        isrc: response.data.isrc,
      },
      include: {
        deezer: true,
        spotify: true,
      },
    });
    if (!track) {
      const newTrack = await prisma.track.create({
        data: {
          name: response.data.title,
          isrc: response.data.isrc,

          deezer: {
            create: {
              deezerId: response.data.id,
              releaseDate: new Date(response.data.release_date),
              readable: response.data.readable,
              gain: response.data.gain,
              duration: response.data.duration,
              explicitLyrics: response.data.explicit_lyrics,
              bpm: response.data.bpm,
              link: response.data.link,
              share: response.data.share,
              preview: response.data.preview,
            },
          },
          artist: {
            connect: {
              id: artistId,
            },
          },
        },
      });
      return newTrack;
    }
    if (!track.deezer) {
      const newTrack = await prisma.track.update({
        where: {
          id: track.id,
        },
        data: {
          deezer: {
            create: {
              deezerId: response.data.id,
              releaseDate: new Date(response.data.release_date),
              readable: response.data.readable,
              gain: response.data.gain,
              duration: response.data.duration,
              explicitLyrics: response.data.explicit_lyrics,
              bpm: response.data.bpm,
              link: response.data.link,
              share: response.data.share,
              preview: response.data.preview,
            },
          },
        },
      });
      return newTrack;
    }
    return track;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const getTrackByISRC = async (token: string, isrc: string) => {
  try {
    const response = await axios.get(
      `https://api.deezer.com/2.0/track/isrc:${isrc}`,
      {
        params: {
          access_token: token,
        },
      }
    );
    await getTrackInfo(response.data.id, token);
    return response.data;
  } catch (err) {
    console.error(err);
  }
};

export const getRecommendation = async (accessToken: string, userId: string) => {
  try {
    const response = await axios.get(
      "https://api.deezer.com/user/me/recommendations/tracks",
      {
        params: {
          access_token: accessToken,
        },
      }
    );
    const trackArr = response.data.data as RecommendationReturn[];

    Promise.all(
      trackArr.map(async (song) => {
        const track = await getTrackInfo(`${song.id}`, accessToken) as {
          id: string
          name: string,
          isrc: string,
          artistId: string,
          createdAt: Date,
          updatedAt: Date
        };
        const userTrack = await prisma.userTracks.findFirst({
          where: {
            userId,
            trackId: track.id,
          },
        });
        if(!userTrack) {
          await prisma.userTracks.create({
            data: {
              userId,
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
        if(newTrack && !newTrack?.spotify) {
          await publish("spotify-new-track", JSON.stringify({
            isrc: track.isrc,
          }));
        }
      })
    );
  } catch (err) {
    console.error(err);
  }
};

export const run = async () => {
  try{
    // setInterval( async () => {
    //   const user = await db.collection("deezerTokens").findOne();
    //   console.log(user)
    //   if (user) {
    //     const tracks = await prisma.track.findMany({
    //       where: {
    //         deezer: null,
    //       },
    //       include: {
    //         deezer: true,
    //       },
    //     });
    //     Promise.all(
    //       tracks.map(async (track) => {
    //         await getTrackByISRC(track.isrc, user.token);
    //       })
    //     );
    //   }
    // }, 30000);
  } catch (err) {
    console.error(err);
  }
}

export interface RecommendationReturn {
  id: number;
  readable: boolean;
  title: string;
  duration: number;
  rank: number;
  explicit_lyrics: false;
  explicit_content_lyrics: number;
  explicit_content_cover: number;
  md5_image: string;
  album: {
    id: number;
    title: string;
    cover: string;
    cover_small: string;
    cover_medium: string;
    cover_big: string;
    cover_xl: string;
    md5_image: string;
    tracklist: string;
    type: string;
  };
  artist: {
    id: number;
    name: string;
    picture: string;
    picture_small: string;
    picture_medium: string;
    picture_big: string;
    picture_xl: string;
    tracklist: string;
    type: string;
  };
  type: string;
}