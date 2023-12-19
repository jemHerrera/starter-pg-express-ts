import express from "express";
import { DI } from "..";
import { Product, User } from "../db/entities";
import argon2 from "argon2";
import { AuthenticatedRequest } from "../middlewares/userAuthenticate";
import { z } from "zod";
import { ProductsSchema } from "../utils/types/Products";

export const UserUpdateOwnRequest = z
  .object({
    password: z
      .object({
        currentPassword: z.string(),
        newPassword: z.string().min(6),
      })
      .optional(),
    isAdmin: z.literal(false).optional(),
  })
  .strict();

export const userUpdateOwn = async (
  req: AuthenticatedRequest<{}, {}, z.infer<typeof UserUpdateOwnRequest>>,
  res: express.Response<Omit<User, "password">>
) => {
  try {
    const { em } = DI;

    if (!req.user) return res.sendStatus(500);

    const invalidRequestBody = !UserUpdateOwnRequest.safeParse(req.body)
      .success;
    if (invalidRequestBody) return res.sendStatus(406);

    const { id } = req.user;

    const user = await em.findOne(User, { id });
    if (!user) return res.sendStatus(500);

    const { password, isAdmin } = req.body;

    if (password) {
      const { currentPassword, newPassword } = password;

      const isVerified = await argon2.verify(user.password, currentPassword);

      if (!isVerified) return res.sendStatus(400);

      user.password = await argon2.hash(newPassword);
    }

    if (isAdmin === false) user.isAdmin = false;

    await em.flush();

    // Remove password from the response
    const { password: p, ...successResponse } = user;

    return res.status(200).json(successResponse).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const UserUpdateRequest = z
  .object({
    id: z.string(),
    options: z.object({
      isAdmin: z.literal(true).optional(),
      product: ProductsSchema.optional(),
    }),
  })
  .strict();

export const userUpdate = async (
  req: AuthenticatedRequest<{}, {}, z.infer<typeof UserUpdateRequest>>,
  res: express.Response<Omit<User, "password">>
) => {
  try {
    const { em } = DI;

    if (!req.user) return res.sendStatus(500);
    if (!req.user.isAdmin) return res.sendStatus(403);

    const invalidRequestBody = !UserUpdateRequest.safeParse(req.body).success;
    if (invalidRequestBody) return res.sendStatus(406);

    const { id, options } = req.body;
    const { isAdmin, product } = options;

    const user = await em.findOne(User, { id });
    if (!user) return res.sendStatus(404);

    if (product) {
      const productEntity = await em.findOne(Product, { name: product });

      if (!productEntity) return res.sendStatus(500);

      user.product = productEntity;
    }

    if (isAdmin) user.isAdmin = true;

    await em.flush();

    // Remove password from the response
    const { password: p, ...successResponse } = user;

    return res.status(200).json(successResponse).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
