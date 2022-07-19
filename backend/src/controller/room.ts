import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { RequestCustom } from "../types/requestCustom";

const prisma = new PrismaClient();

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
            include: {
              spotify: true,
              deezer: true,
            },
          },
          users: {
            include: {
              user: {
                include: {
                  spotify: true,
                  deezer: true,
                },
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
            include: {
              spotify: true,
              deezer: true,
            },
          },
          users: {
            include: {
              user: {
                include: {
                  spotify: true,
                  deezer: true,
                },
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
            include: {
              spotify: true,
              deezer: true,
            }
          },
          users: {
            include: {
              user: {
                include: {
                  votes: true,
                  spotify: true,
                  deezer: true,
                }
              }
            }
          },

          tracks: {
            include: {
              track: {
                include: {
                  artist: true,
                  contributors: true,
                  deezer: true,
                  spotify: true,
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
        throw new Error("You are not allowed to access this room");
      res.status(200).json({
        room,
      });
    } catch (err) {
      res.status(500).json({
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
          const tracks = await prisma.userTracks.findMany({
            where: {
              userId: user.id,
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
          users: true,
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
  }
};
