import express from "express";
import { DI } from "..";
import { User } from "../db/entities";
import { AuthenticatedRequest } from "../middlewares/userAuthenticate";

declare namespace Express {
  interface Request {
    userId?: string;
  }
}

export const userGetOwn = async (
  req: AuthenticatedRequest,
  res: express.Response
) => {
  try {
    const { em } = DI;

    if (!req.userId) return res.sendStatus(500);

    const user = await em.findOne(User, { id: req.userId });
    if (!user) return res.sendStatus(500);

    // Remove password from the response
    const { password: p, ...successResponse } = user;

    return res.status(200).json(successResponse).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
