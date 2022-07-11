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
              Track: {
                include: {
                  artist: true,
                  contributors: true,
                }
              }
            }
          },
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
                  spotify: true,
                  deezer: true,
                }
              }
            }
          }
        },
      });
      const roomsMember = await prisma.room.findMany({
        where: {
          users: {
            some: {
              id: req.user.id,
            },
          },
        },
        include: {
          tracks: {
            include: {
              Track: {
                include: {
                  artist: true,
                  contributors: true,
                }
              }
            }
          },
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
                  spotify: true,
                  deezer: true,
                }
              }
            }
          }
        },
      });
      const rooms = [...roomsOwner, ...roomsMember];
      res.json(rooms);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: err,
      });
    }
  },
  async create(req: Request, res: Response) {
    try {
      const { name, userId } = req.body;
      const room = await prisma.room.create({
        data: {
          name,
          owner: {
            connect: {
              id: userId,
            },
          },
        },
      });
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
  async get(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const room = await prisma.room.findUnique({
        where: {
          id,
        },
      });
      res.status(200).json({
        message: "Room found",
        room,
      });
    } catch (err) {
      res.status(500).json({
        message: err,
      });
    }
  },
  async join(req: Request, res: Response) {
    try {
      const { userId } = req.body;
      const { id } = req.params;
      if (!userId) throw new Error("UserId is required");
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
      if (!user) throw new Error("User not found");
      if (!id) throw new Error("RoomId is required");
      const room = await prisma.room.findUnique({
        where: {
          id,
        },
      });
      if (!room) throw new Error("Room not found");
      const roomUsers = await prisma.roomUser.findFirst({
        where: {
          roomId: id,
          userId,
        },
      });
      if (roomUsers) {
        res.status(200).json({
          message: "User already in room",
        });
      } else {
        const roomUser = await prisma.roomUser.create({
          data: {
            roomId: id,
            userId: user.id,
          },
        });
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
};
