import express from "express";
import { DI } from "..";
import { User } from "../db/entities";
import { z } from "zod";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

export const UserLoginRequest = z
  .object({
    email: z.string(),
    password: z.string().min(6),
  })
  .strict();

export type UserLoginRequest = z.infer<typeof UserLoginRequest>;
export type UserLoginResponse = { sessionToken: string };
export type SessionTokenPayload = { id: string };

export const userLogin = async (
  req: express.Request<{}, {}, UserLoginRequest>,
  res: express.Response
) => {
  try {
    const { em } = DI;

    const invalidRequestBody = !UserLoginRequest.safeParse(req.body).success;
    if (invalidRequestBody) return res.sendStatus(406);

    const { password, email } = req.body;

    const user = await em.findOne(User, { email });
    if (!user) return res.sendStatus(400);

    const authenticated = await argon2.verify(user.password, password);
    if (!authenticated) return res.sendStatus(400);

    const sessionToken = jwt.sign(
      { id: user.id } as SessionTokenPayload,
      process.env.USER_JWT_PRIVATE_KEY || "",
      { expiresIn: "4h" }
    );

    res
      .status(200)
      .json({ sessionToken } as UserLoginResponse)
      .end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
