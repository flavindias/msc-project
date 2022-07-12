import axios from "axios";
import dotenv from "dotenv";
import db from "../middlewares/mongo";
import { encodeUserToken } from "../middlewares/acl";
import { Request, Response } from "express";
import { compare, hashSync } from "bcryptjs";
import { getToken } from "../middlewares/deezer";
import { KafkaConnection } from "../middlewares/kafka";
import { RequestCustom } from "../types/requestCustom";
import { PrismaClient, User, SpotifyInfo, DeezerInfo } from "@prisma/client";
dotenv.config();

const prisma = new PrismaClient();
const kafka = KafkaConnection.getInstance();

const findUser = async (email: string) => {
  const user = await prisma.user.findFirst({
    where: {
      email,
    },
    include: {
      spotify: true,
      deezer: true,
    },
  });
  return user as User & { spotify: SpotifyInfo; deezer: DeezerInfo };
};

export const AuthController = {
  async spotify(req: Request, res: Response) {
    try {
      const {
        id,
        product,
        country,
        picture,
        type,
        uri,
        email,
        display_name,
        token,
      } = req.body;

      const user = await prisma.user.findFirst({
        where: {
          email,
        },
        include: {
          spotify: true,
          deezer: true,
        },
      });
      if (!user) throw new Error("User not found");

      let userResponse: User;
      const spotify = {
        id,
        product,
        country,
        picture,
        type,
        uri,
      };
      if (!user) {
        userResponse = await prisma.user.create({
          data: {
            email: email,
            name: display_name,
            password: hashSync(
              (Math.random() + 1).toString(36).substring(7),
              10
            ),
            spotify: {
              create: spotify,
            },
          },
        });
      } else {
        userResponse = user;
      }
      if (!user.spotify) {
        userResponse = await prisma.user.update({
          where: {
            email: user.email,
          },
          data: {
            spotify: {
              create: spotify,
            },
          },
        });
      }
      const usr = {
        userId: userResponse.id,
        token,
        createdAt: new Date(),
      };
      // await kafka.publish("spotify-login", JSON.stringify(usr));
      await db.collection("spotifyTokens").insertOne(usr);
      return res
        .status(200)
        .json({
          user: userResponse,
          token,
          deejaiToken: encodeUserToken(userResponse.id),
        });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Error while trying to authenticate with Spotify",
      });
    }
  },

  async deezer(req: Request, res: Response) {
    try {
      const { token } = req.body;
      const authToken = await getToken(token);
      const response = await axios.get(`https://api.deezer.com/user/me`, {
        params: {
          access_token: authToken,
        },
      });
      if (!response.data.id) throw new Error("Authentication failed");

      const user = await findUser(response.data.email);
      let userResponse: User;

      const deezer = {
        id: `${response.data.id}`,
        country: response.data.country,
        isKid: response.data.is_kid,
        link: response.data.link,
        picture: response.data.picture_medium,
      };
      console.log(deezer)
      if (!user) {
        userResponse = await prisma.user.create({
          data: {
            email: response.data.email,
            password: hashSync(
              (Math.random() + 1).toString(36).substring(7),
              10
            ),
            name: response.data.name,
            deezer: {
              create: deezer,
            },
          },
        });
      } else {
        userResponse = user;
      }
      console.log(userResponse)
      if (!user.deezer) {
        userResponse = await prisma.user.update({
          where: {
            email: user.email,
          },
          data: {
            deezer: {
              create: deezer,
            },
          },
        });
      }
      const usr = {
        userId: userResponse.id,
        token: authToken,
        createdAt: new Date(),
      };
      // await kafka.publish("deezer-login", JSON.stringify(usr));
      await db.collection("deezerTokens").insertOne(usr);
      return res.status(200).json({
        user: userResponse,
        token: authToken,
        deejaiToken: encodeUserToken(userResponse.id),
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Error while trying to authenticate with Deezer",
      });
    }
  },
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password) throw new Error("Email or password is missing");
      const user = await findUser(email);
      if (!user) throw new Error("User not found");
      const isValid = await compare(password, `${user.password}`);
      if (!isValid) throw new Error("Invalid email or password");

      return res.status(200).json({ user, token: encodeUserToken(user.id) });
    } catch (err) {
      return res.status(500).json({
        message: "Error while trying to authenticate",
      });
    }
  },
  async me(expressRequest: Request, res: Response) {
    try {
      const req = expressRequest as RequestCustom;
      if (!req.user) throw new Error("User not found");
      const user = await prisma.user.findUnique({
        where: {
          id: req.user.id,
        },
        include: {
          spotify: true,
          deezer: true,
        },
      });
      return res.status(200).json({ user });
    } catch (err) {
      return res.status(500).json({
        message: "Error while trying to get user",
      });
    }
  },
};
