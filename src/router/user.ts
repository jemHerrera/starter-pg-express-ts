import express from "express";
import { userGetOwn } from "../controllers/userGet";
import { userCreate } from "../controllers/userCreate";
import { userLogin } from "../controllers/userLogin";
import { userAuthenticate } from "../middlewares/userAuthenticate";

export default (router: express.Router) => {
  router.get("/user", userAuthenticate, userGetOwn);
  router.post("/register", userCreate);
  router.post("/login", userLogin);
};
