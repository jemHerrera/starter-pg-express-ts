import express from "express";
import { z } from "zod";
import { User } from "../db/entities";
import { AuthenticatedRequest } from "../middlewares/userAuthenticate";
import { DI } from "..";

export const userList = async (
  req: AuthenticatedRequest<{}, {}, { limit?: number; offset?: number }>,
  res: express.Response<{ users: Omit<User, "password">[]; total: number }>
) => {
  try {
    const { em } = DI;

    if (!req.user) return res.sendStatus(500);
    if (!req.user.isAdmin) return res.sendStatus(403);

    const { limit = 100, offset = 0 } = req.body;

    const [users, total] = await em.findAndCount(User, {}, { limit, offset });
    if (!users) return res.sendStatus(500);

    return res
      .status(200)
      .json({
        users: users.map((user) => {
          const { password: p, ...successResponse } = user;
          return successResponse;
        }),
        total,
      })
      .end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
