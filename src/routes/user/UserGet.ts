import express from "express";
import { DI } from "../..";
import { User } from "../../db/entities";

export const userGet = async (req: express.Request, res: express.Response) => {
  try {
    const { em } = DI;
    const { id } = req.params;

    const user = await em.findOne(User, id);

    if (!user) return res.sendStatus(404);

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
