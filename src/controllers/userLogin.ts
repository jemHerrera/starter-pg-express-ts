import express from "express";
import { DI } from "..";
import { User } from "../db/entities";
import { z } from "zod";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { SessionTokenPayload } from "../middlewares/userAuthenticate";

export const UserLoginRequest = z
  .object({
    email: z.string(),
    password: z.string().min(6),
  })
  .strict();

export const userLogin = async (
  req: express.Request<{}, {}, z.infer<typeof UserLoginRequest>>,
  res: express.Response<{ sessionToken: string }>
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
      {
        id: user.id,
        isAdmin: !!user.isAdmin,
        emailVerified: !!user.emailVerified,
      } as SessionTokenPayload,
      process.env.USER_JWT_PRIVATE_KEY || "",
      { expiresIn: "4h" }
    );

    res.status(200).json({ sessionToken }).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
