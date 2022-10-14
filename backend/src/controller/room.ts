import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { RequestCustom } from "../types/requestCustom";

const prisma = new PrismaClient();

const deejaiReccomentadion = async () => {
  try {
    const roomId = "";
    const room = await prisma.room.findUnique({
      where: {
        id: roomId,
      },
    });
    if (!room) throw new Error("Room not found");
    const users = await prisma.roomUser.findMany({
      where: {
        roomId
      },
    });
    const members = [...users.map((user) => user.userId), room.ownerId];
    const tracks = await prisma.userTracks.findMany({
      where: {
        userId: {
          in: members,
        },
      },
      include: {
        track: {
          include: {
            artist: {
              include: {
                genres: true,
              },
            }
          }
        },
      },
    });
  }
  catch (error) {
    console.log(error);
  }

};
export const RoomController = {
  async list(expressRequest: Request, res: Response) {
    const req = expressRequest as RequestCustom;
    try {
      const roomsOwner = await prisma.room.findMany({
        where: {
          ownerId: req.user.id,
        },
        include: {
          tracks: {
            include: {
              track: {
                include: {
                  artist: true,
                  contributors: true,
                },
              },
            },
          },
          owner: {
            // include: {
            //   spotify: true,
            //   deezer: true,
            // },
            select: {
              name: true,
              
              spotify: true,
              deezer: true
            }
          },
          users: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  spotify: true,
                  deezer: true,

                },
                // include: {
                //   spotify: true,
                //   deezer: true,
                // },
              },
            },
          },
        },
      });
      const roomUsers = await prisma.roomUser.findMany({
        where: {
          userId: req.user.id,
        },
        select:{
          roomId: true,
        }
      });
      const roomsMember = await prisma.room.findMany({
        where: {
          id: {
            in: roomUsers.map(roomUser => roomUser.roomId),
          },
        },
        include: {
          tracks: {

            include: {
              track: {
                
                include: {
                  artist: true,
                  contributors: true,
                },
              },
            },
          },
          owner: {
            select: {
              id: true,
                  name: true,
                  spotify: true,
                  deezer: true,
            },
            // include: {
            //   spotify: true,
            //   deezer: true,
            // },
          },
          users: {
            include: {
              user: {
                select: {
                  id: true,
                      name: true,
                      spotify: true,
                      deezer: true,
                },
                // include: {
                //   spotify: true,
                //   deezer: true,
                // },
              },
            },
          },
        },
      });
      const rooms = [...roomsOwner, ...roomsMember];
      res.json(rooms);
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: err,
      });
    }
  },
  async create(expressRequest: Request, res: Response) {
    try {
      const req = expressRequest as RequestCustom;
      const { name, isPrivate, deejai } = req.body;

      const room = await prisma.room.create({
        data: {
          name,
          isPrivate: !!isPrivate,
          deejai: !!deejai,
          owner: {
            connect: {
              id: req.user.id,
            },
          },
        },
      });
      if (!!deejai) {
        const tracks = await prisma.userTracks.findMany({
          where: {
            userId: req.user.id,
            vote: {
              in: ["NEUTRAL", "LIKE"]
            }
          },
        });
        const tracksToAdd = tracks.map((track) => {
          return {
            roomId: room.id,
            trackId: track.trackId,
          };
        });

        await prisma.roomTracks.createMany({
          data: tracksToAdd,
        });
      }
      res.status(201).json({
        message: "Room created",
        room,
      });
    } catch (err) {
      res.status(500).json({
        message: err,
      });
    }
  },
  async get(expressRequest: Request, res: Response) {
    try {
      const req = expressRequest as RequestCustom;
      const { id } = req.params;
      const room = await prisma.room.findUnique({
        where: {
          id,
        },
        include: {
          owner: {
            select: {
              id: true,
                  name: true,
                  spotify: true,
                  deezer: true,
            },
            
          },
          users: {
            include: {
              
              user: {
                select: {
                  id: true,
                      name: true,
                      spotify: true,
                      deezer: true,
                      votes: true
                },
                
              }
            },

          },

          tracks: {
            include: {
              track: {
                include: {
                  artist: true,
                  contributors: true,
                  deezer: true,
                  spotify: true,
                  evaluation: {
                    where: {
                      userId: req.user.id
                    },
                    select: {
                      vote: true
                    }
                  }
                },
              },
            },
          },
        },
      });
      if (!room) throw new Error("Room not found");
      if (
        room.ownerId !== req.user.id &&
        !room.users.some((user) => user.userId === req.user.id)
      )
        return res.status(403).json({
          message: "You are not allowed to access this room",
        });
      return res.status(200).json({
        room,
      });
    } catch (err) {
      return res.status(500).json({
        message: err,
      });
    }
  },
  async join(expressRequest: Request, res: Response) {
    try {
      const req = expressRequest as RequestCustom;
      const { id } = req.params;
      if (!req.user.id) throw new Error("UserId is required");
      const user = req.user;
      if (!user) throw new Error("User not found");
      if (!id) throw new Error("RoomId is required");
      const room = await prisma.room.findUnique({
        where: {
          id,
        },
      });

      if (!room) throw new Error("Room not found");
      if (room.ownerId === user.id)
        throw new Error("You can't join your own room");
      const roomUsers = await prisma.roomUser.findFirst({
        where: {
          roomId: id,
          userId: req.user.id,
        },
      });
      if (roomUsers) {
        res.status(403).json({
          message: "User already in room",
        });
      } else {
        const roomUser = await prisma.roomUser.create({
          data: {
            roomId: id,
            userId: user.id,
          },
        });
        if(room.deejai) {
          const alreadyTracks = await prisma.roomTracks.findMany({
            where: {
              roomId: room.id
            }
          });
          const tracks = await prisma.userTracks.findMany({
            take: 15,
            where: {
              userId: user.id,
              vote: {
                in: ["NEUTRAL", "LIKE"]
              }
            },
          });

          const tracksToAdd = [...tracks.map((track) => {
            return {
              roomId: room.id,
              trackId: track.trackId,
            };
          }), ...alreadyTracks.map(track => {
            return {
              roomId: room.id,
              trackId: track.trackId
            }
          })].filter((v,i,a)=>a.findIndex(v2=>(v2.trackId===v.trackId))===i);
          await prisma.roomTracks.deleteMany({
            where: {
              roomId: room.id
            }
          });
          await prisma.roomTracks.createMany({
            data: tracksToAdd,
          });
        }
        res.status(201).json({
          message: "User added to room",
          roomUser,
        });
      }
    } catch (err) {
      res.status(500).json({
        message: err,
      });
    }
  },
  async leave(expressRequest: Request, res: Response) {
    console.log(expressRequest);
    res.send("leave");
  },
  async addTrack(expressRequest: Request, res: Response) {
    try{
      const req = expressRequest as RequestCustom;
      const { id } = req.params;
      const { trackId } = req.body;
      if (!id) throw new Error("RoomId is required");
      if (!trackId) throw new Error("TrackId is required");
      const room = await prisma.room.findUnique({
        where: {
          id,
        },
        include:{
          users: {
            select: {
              userId: true
            }
          },
          
        }
      });
      if (!room) throw new Error("Room not found");
      const members = room.users.map(user => user.userId);
      if (room.ownerId !== req.user.id && !members.includes(req.user.id))
        throw new Error("You can't add track to this room");
      const roomTrack = await prisma.roomTracks.findFirst({
        where: {
          roomId: id,
          trackId,
        },
      });
      if (roomTrack) {
        res.status(403).json({
          message: "Track already in room",
        });
      } else {
        const roomTrack = await prisma.roomTracks.create({
          data: {
            roomId: id,
            trackId,
          },
        });
        res.status(201).json({
          message: "Track added to room",
          roomTrack,
        });
      }

    }
    catch(err) {
      console.error(err);
      res.status(500).json({
        message: err,
      });
    }
  },
  async createPlaylist(expressRequest: Request, res: Response) {
    try{
      await deejaiReccomentadion();
      // const req = expressRequest as RequestCustom;
      // const { id } = req.params;
      // if (!id) throw new Error("RoomId is required");
      // const room = await prisma.room.findUnique({
      //   where: {
      //     id,
      //   },
      //   include:{
      //     users: {
      //       select: {
      //         userId: true
      //       }
      //     },
          
      //   }
      // });
      // if (!room) throw new Error("Room not found");
      // const members = room.users.map(user => user.userId);
      // if (room.ownerId !== req.user.id && !members.includes(req.user.id))
      //   throw new Error("You can't create playlist to this room");
      
      // res.status(201).json({
      //   message: "Playlist created",
      // });
    }
    catch(err) {
      console.error(err);
      res.status(500).json({
        message: err,
      });
    }
  }
};
