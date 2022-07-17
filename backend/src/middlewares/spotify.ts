import axios from "axios";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
dotenv.config();

const prisma = new PrismaClient();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const saveNewTrack = async (spTrack: any) => {
  try {
    let artistId = "";
    const { artists }  = spTrack;
    if(artists && artists.length > 0){
      const artist = artists[0];
      const { id, images, name, uri, href, external_urls } = artist;
      const checkArtist = await prisma.spotifyArtist.findUnique({
        where: {
          spotifyId: id,
        },
      });
      if (checkArtist) artistId = checkArtist.artistId;
      if (!checkArtist) {
        const checkArtistByName = await prisma.artist.findFirst({
          where: {
            name,
          },
        });
        const picture = images && images.length > 0 ? images[0].url : "";
        if (!checkArtistByName) {
          const newArtist = await prisma.artist.create({
            data: {
              name,
              picture,
              spotify: {
                create: {
                  spotifyId: id,
                  uri: uri,
                  href: href,
                  url: external_urls.spotify,
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
                  spotifyId: id,
                  uri: uri,
                  href: href,
                  url: external_urls.spotify,
                },
              },
            },
          });
          artistId = newArtist.id;
        }
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
    console.error(err);
    return null
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
      })
    );
  } catch (error) {
    console.error(error);
  }
};

const getTrackInfo = async (isrc: string, token: string) => {
  try {
    const  {data } = await axios.get(
      `https://api.spotify.com/v1/search?type=track&q=isrc:${isrc}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params:{
          limit: 1,
          offset: 0,
        }
      }
    );
    if(data.tracks && data.tracks.items && data.tracks.items.length > 0){
      return data.tracks.items[0];
    }
    
    return null;
  }
  catch (error) {
    console.error(error);
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
    console.error(error);
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
