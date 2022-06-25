import axios from "axios";
import dotenv from "dotenv";
import { getTrackByISRC as SpotifyISRC } from "./spotify";
import { PrismaClient, Artist, DeezerArtist } from "@prisma/client";
dotenv.config();

const { DEEZER_APP_ID, DEEZER_APP_SECRET } = process.env;
const prisma = new PrismaClient();

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
    console.log(err);
  }
};

export const getTracks = async (token: string) => {
  try {
    console.log(token, "token");
    const response = await axios.get("https://api.deezer.com/user/me/tracks", {
      params: {
        access_token: token,
      },
    });
    console.log(response.data, "getTracks");
    return response.data.data;
  } catch (err) {
    console.log(err);
  }
};

export const getTrackInfo = async (id: string, accessToken: string) => {
  try {
    const response = await axios.get(`https://api.deezer.com/track/${id}`, {
      params: {
        access_token: accessToken,
      },
    }); 
    let artistId = '';
    const checkArtist = await prisma.deezerArtist.findUnique({
      where: {
        deezerId: response.data.artist.id,
      },
    });
    if(checkArtist) artistId = checkArtist.artistId;

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
            deezer: {
              create: {
                deezerId: response.data.artist.id,
                radio: response.data.artist.radio,
                link: response.data.artist.link,
                share: response.data.artist.share,
                tracklist: response.data.artist.tracklist,
              }
            }
          },
        });
        artistId = newArtist.id;
      } else {
        const newArtist = await prisma.artist.update({
          where: {
            id: checkArtistByName.id,
          },
          data: {
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
          }
          
         
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
    console.log(error);
  }
};
export const getArtistInfo = () => {
  console.log("getArtistInfo");
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
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const getRecommendation = async (accessToken: string) => {
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

    trackArr.forEach((song) => {
      getTrackInfo(`${song.id}`, accessToken);
    });
  } catch (err) {
    console.log(err);
  }
};

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
