import axios from "axios";
import { Request, Response } from "express";
import { getToken, getTracks } from "./deezer";
import { PrismaClient, User, SpotifyInfo, DeezerInfo } from "@prisma/client";

const prisma = new PrismaClient();
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
            spotify: {
              create: spotify,
            },
          },
        });
        return res.status(200).json(newUser);
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
        return res.status(200).json(updatedUser);
      }

      return res.status(200).json(user);
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
            name: response.data.name,
            deezer: {
              create: deezer,
            },
          },
        });
        return res.status(200).json(newUser);
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
        return res.status(200).json(updatedUser);
      }
      await getTracks(authToken);
      
      return res.status(200).json(user);
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Error while trying to authenticate with Deezer",
      });
    }
  },
};
