import axios from "axios";
import dotenv from "dotenv";
import { sign } from "jsonwebtoken";
import { compare, hashSync } from "bcryptjs";
import { Request, Response } from "express";
import { getToken, getTracks } from "./deezer";
import { PrismaClient, User, SpotifyInfo, DeezerInfo } from "@prisma/client";
dotenv.config();

const prisma = new PrismaClient();
const { JWT_SECRET } = process.env;

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

const token = (id: string) => sign({ id }, `${JWT_SECRET}`);

export const AuthController = {
  async spotify(req: Request, res: Response) {
    try {
      const { token } = req.body;
      const response = await axios.get(`https://api.spotify.com/v1/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const user = await findUser(response.data.email);
      const spotify = {
        id: response.data.id,
        product: response.data.product,
        country: response.data.country,
        picture: response.data.images[0].url,
        type: response.data.type,
        uri: response.data.uri,
      };
      if (!user) {
        const newUser = await prisma.user.create({
          data: {
            email: response.data.email,
            name: response.data.display_name,
            password: hashSync((Math.random() + 1).toString(36).substring(7), 10),
            spotify: {
              create: spotify,
            },
          },
        });
        
        return res.status(200).json({user: newUser, token: token(newUser.id) });
      }
      if (!user.spotify) {
        const updatedUser = await prisma.user.update({
          where: {
            email: user.email,
          },
          data: {
            spotify: {
              create: spotify,
            },
          },
        });
        return res.status(200).json({user: updatedUser, token: token(updatedUser.id) });
      }

      return res.status(200).json({user, token: token(user.id) });
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
      const user = await findUser(response.data.email);
      const deezer = {
        id: `${response.data.id}`,
        country: response.data.country,
        isKid: response.data.is_kid,
        link: response.data.link,
        picture: response.data.picture_medium,
      };
      if (!user) {
        const newUser = await prisma.user.create({
          data: {
            email: response.data.email,
            password: hashSync((Math.random() + 1).toString(36).substring(7), 10),
            name: response.data.name,
            deezer: {
              create: deezer,
            },
          },
        });
        return res.status(200).json({user:newUser, token: token(newUser.id) });
      }
      if (!user.deezer) {
        const updatedUser = await prisma.user.update({
          where: {
            email: user.email,
          },
          data: {
            deezer: {
              create: deezer,
            },
          },
        });
        return res.status(200).json({user:updatedUser, token: token(updatedUser.id) });
      }
      await getTracks(authToken);
      
      return res.status(200).json({user, token: token(user.id) });
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
      if(!email || !password) throw new Error("Email or password is missing");
      const user = await findUser(email);
      if (!user) throw new Error("User not found");
      const isValid = await compare(password, `${user.password}`);
      if (!isValid) throw new Error("Invalid email or password");
      
      return res.status(200).json({user, token: token(user.id) });
    }
    catch (err) {
      return res.status(500).json({
        message: "Error while trying to authenticate",
      });
    }
  }
};
