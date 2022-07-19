import dotenv from "dotenv";
import { sign, verify } from "jsonwebtoken";
import { generateKeyPairSync } from "crypto";
import { PrismaClient } from "@prisma/client";
import { RequestCustom } from "../types/requestCustom";
import { Request, Response, NextFunction } from "express";
dotenv.config();

const prisma = new PrismaClient();
const { JWT_SECRET } = process.env;

const { publicKey, privateKey } = generateKeyPairSync("rsa", {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: "spki",
    format: "pem",
  },
  privateKeyEncoding: {
    type: "pkcs8",
    format: "pem",
    cipher: "aes-256-cbc",
    passphrase: JWT_SECRET,
  },
});

export function decodeUserToken(header: string): string | undefined {
  try {
    const token = header.replace(/^Bearer\s/, "");
    const { id } = verify(token, publicKey, {
      algorithms: ["RS256"],
    }) as {
      id: string;
      iat: number;
    };
    return id;
  } catch (err) {
    throw new Error("Permission Denied - Incorrect Token");
  }
}

export function encodeUserToken(id: string): string {
  try {
    const token = sign(
      { id },
      { key: privateKey, passphrase: `${JWT_SECRET}` },
      { algorithm: "RS256" }
    );
    return token;
  } catch (err) {
    throw new Error("Permission Denied - Can't create User Token");
  }
}

export const checkUser = () => {
  return async (expressRequest: Request, res: Response, next: NextFunction) => {
    try {
      const req = expressRequest as RequestCustom;
      if (!req.headers.authorization) throw new Error("No token provided");
      const userId = decodeUserToken(req.headers.authorization);
      if (!userId) throw new Error("Permission Denied - No Token");
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
      if (!user) throw new Error("Permission Denied - User Not Found");
      req.user = user;
      req.user.password = null
      next();
    } catch (err) {
      res.status(401).send({
        message: `${err}`,
      });
    }
  };
};

export const checkAdmin = (needAdmin: boolean) => {
  return async (expressRequest: Request, res: Response, next: NextFunction) => {
    try {
      const req = expressRequest as RequestCustom;
      if (!req.user) throw new Error("No user provided");
      const user = req.user;
      if (!user) throw new Error("Permission Denied - User Not Found");
      req.user = user;
      if (user.isAdmin !== needAdmin)
        throw new Error("Permission Denied - Insufficient Role");
      next();
    } catch (err) {
      res.status(401).send({
        message: `${err}`,
      });
    }
  };
};

