import express from "express";
import { ParamsDictionary } from "express-serve-static-core";
import jwt from "jsonwebtoken";

export type SessionTokenPayload = {
  id: string;
  isAdmin: boolean;
  emailVerified: boolean;
};

export interface AuthenticatedRequest<
  P extends ParamsDictionary = {},
  ResBody = {},
  ReqBody = {},
  Locals extends Record<string, any> = {}
> extends express.Request<P, ResBody, ReqBody, Locals> {
  user?: SessionTokenPayload;
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

    req.user = user as SessionTokenPayload;

    next();
  });
}
