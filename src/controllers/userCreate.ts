import express from "express";
import { User } from "../db/entities";
import { DI } from "../index";
import z from "zod";
import argon2 from "argon2";

import { Product } from "../db/entities/Product";

export const UserCreateRequest = z
  .object({
    email: z.string().email(),
    username: z.string(),
    password: z.string().min(6),
  })
  .strict();

export const userCreate = async (
  req: express.Request<{}, {}, z.infer<typeof UserCreateRequest>>,
  res: express.Response<Omit<User, "password">>
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

    const hashedPassword = await argon2.hash(password);

    const defaultProduct = await em.findOne(Product, { name: "Trial" });
    if (!defaultProduct) return res.sendStatus(500);

    const user = em.create(User, {
      email,
      password: hashedPassword,
      username,
      product: defaultProduct,
    });

    await em.flush();

    // Remove password from the response
    const { password: p, ...successResponse } = user;

    return res.status(200).json(successResponse).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
