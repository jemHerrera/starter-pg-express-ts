import express from "express";
import jwt from "jsonwebtoken";
import { SessionTokenPayload } from "../controllers/userLogin";

export interface AuthenticatedRequest extends express.Request {
  userId?: string;
}

export function userAuthenticate(
  req: AuthenticatedRequest,
  res: express.Response,
  next: express.NextFunction
) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.USER_JWT_PRIVATE_KEY as string, (err, user) => {
    if (err || !user) return res.sendStatus(403);

    req.userId = (user as SessionTokenPayload).id;

    next();
  });
}
