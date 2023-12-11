import express from "express";
import { User } from "../../db/entities";
import { DI } from "../../index";
import z from "zod";
import { hashPassword } from "../../utils/hashPassword";

export const UserCreateRequest = z
  .object({
    email: z.string().email(),
    username: z.string(),
    password: z.string().min(6),
  })
  .strict();

export type UserCreateRequest = z.infer<typeof UserCreateRequest>;

export const userCreate = async (
  req: express.Request<{}, {}, UserCreateRequest>,
  res: express.Response
) => {
  try {
    const { em } = DI;

    const invalidRequestBody = !UserCreateRequest.safeParse(req.body).success;

    if (invalidRequestBody) return res.sendStatus(406);

    const { email, password, username } = req.body;

    const existingUser = !!(await em.findOne(User, {
      $or: [{ email }, { username }],
    }));

    if (existingUser) return res.sendStatus(409);

    const hashedPassword = await hashPassword(password);

    const user = em.create(User, { email, password: hashedPassword, username });

    await em.flush();

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
