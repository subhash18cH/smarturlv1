import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface AuthenticateRequest extends Request {
  user?: {
    email: string,
    userId: string
  }
}

interface DecodedToken {
  email: string;
  userId: string;
  iat?: number;
  exp?: number;
}

export const validateToken = async (req: AuthenticateRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers["authorization"] || req.headers["Authorization"];
    const token = typeof authHeader == "string" && authHeader.startsWith("Bearer") && authHeader.split(" ")[1];
    if (!token) {
      res.status(400).json("token not present");
      return;
    }
    jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
      if (err) {
        res.status(400);
        return;
      }
      const { email, userId } = decoded as DecodedToken;
      req.user = {
        userId,
        email
      }
      next();
    }
    )
  } catch (error) {
    res.status(400).json({ message: "Something went wrong" });
  }
}