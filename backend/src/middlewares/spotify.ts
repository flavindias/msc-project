import axios from "axios";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
dotenv.config();

const prisma = new PrismaClient();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const saveNewTrack = async (spTrack: any) => {
  try {
    let artistId = "";
    const checkArtist = await prisma.spotifyArtist.findUnique({
      where: {
        spotifyId: spTrack.artists[0].id,
      },
    });
    if (checkArtist) artistId = checkArtist.artistId;
    if (!checkArtist) {
      const checkArtistByName = await prisma.artist.findFirst({
        where: {
          name: spTrack.artists[0].name,
        },
      });
      if (!checkArtistByName) {
        const newArtist = await prisma.artist.create({
          data: {
            name: spTrack.artists[0].name,
            picture: spTrack.artists[0].images[0].url,
            spotify: {
              create: {
                spotifyId: spTrack.artists[0].id,
                uri: spTrack.artists[0].uri,
                href: spTrack.artists[0].href,
                url: spTrack.artists[0].external_urls.spotify,
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
            spotify: {
              create: {
                spotifyId: spTrack.artists[0].id,
                uri: spTrack.artists[0].uri,
                href: spTrack.artists[0].href,
                url: spTrack.artists[0].external_urls.spotify,
              },
            },
          },
        });
        artistId = newArtist.id;
      }
    }
    const track = await prisma.track.findUnique({
      where: {
        isrc: spTrack.external_ids.isrc,
      },
      include: {
        deezer: true,
        spotify: true,
      },
    });
    if (!track) {
      const newTrack = await prisma.track.create({
        data: {
          name: spTrack.name,
          isrc: spTrack.external_ids.isrc,
          spotify: {
            create: {
              spotifyId: spTrack.id,
              uri: spTrack.uri,
              href: spTrack.href,
              previewUrl: spTrack.preview_url,
              isLocal: spTrack.is_local,
              popularity: spTrack.popularity,
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
    if (track && !track.spotify) {
      const newTrack = await prisma.track.update({
        where: {
          id: track.id,
        },
        data: {
          spotify: {
            create: {
              spotifyId: spTrack.id,
              uri: spTrack.uri,
              href: spTrack.href,
              previewUrl: spTrack.preview_url,
              isLocal: spTrack.is_local,
              popularity: spTrack.popularity,
            },
          },
        },
      });
      return newTrack;
    }
    return track;
  } catch (err) {
    return null
    console.log(err);
  }
};

export const getTopTracks = async (token: string, userId: string) => {
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/me/top/tracks`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          limit: 50,
          offset: 0,
        },
      }
    );

    const { items } = response.data;
    Promise.all(
      items.map(async (item: { external_ids: { isrc: string } }) => {
        const track = await getTrackByISRC(item.external_ids.isrc, token);
        if (track) {
          const checkTrack = await prisma.userTracks.findFirst({
            where: {
              userId,
              trackId: track.id,
            },
          });
          if (!checkTrack) {
            await prisma.userTracks.create({
              data: {
                user: {
                  connect: {
                    id: userId,
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
        }
        console.log(track, "topTracks");
      })
    );
  } catch (error) {
    console.log(error);
  }
};

const getTrackInfo = async (isrc: string, token: string) => {
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/search?type=track&q=isrc:${isrc}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.tracks.items[0];
  }
  catch (error) {
    console.log(error);
  }
};

export const getTrackByISRC = async (isrc: string, token: string) => {
  try {
    const track = await prisma.track.findUnique({
      where: {
        isrc,
      },
      include: {
        spotify: true,
      },
    });
    if (!track) {
      const trackInfo = await getTrackInfo(isrc, token);
      if (trackInfo) {
        const newTrack = await saveNewTrack(trackInfo);
        return newTrack;
      }
      else{
        throw new Error("Track not found");
      }
    }
    else if (track && !track.spotify) {
      const trackInfo = await getTrackInfo(isrc, token);
      if (trackInfo) {
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
      else{
        throw new Error("Track not found");
      }
      
      return track;
    }
    else{
      return track;
    }
    
  } catch (error) {
    console.log(error);
  }
};

export const run = async () => {
  try {
    // setInterval(async () => {
    //   const user = await db.collection("spotifyTokens").findOne();
    //   if (user) {
    //     const tracks = await prisma.track.findMany({
    //       where: {
    //         spotify: null,
    //       },
    //       include: {
    //         spotify: true,
    //       },
    //     });
    //     Promise.all(
    //       tracks.map(async (track) => {
    //         await getTrackByISRC(track.isrc, user.token);
    //       })
    //     );
    //   }
    // }, 30000);
  } catch (error) {
    console.error(error);
  }
};
