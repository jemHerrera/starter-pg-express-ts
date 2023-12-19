import express from "express";
import { userGet, userGetOwn } from "../controllers/userGet";
import { userCreate } from "../controllers/userCreate";
import { userLogin } from "../controllers/userLogin";
import { userAuthenticate } from "../middlewares/userAuthenticate";
import { userList } from "../controllers/userList";
import { userUpdate, userUpdateOwn } from "../controllers/userUpdate";
import { userDelete } from "../controllers/userDelete";

export default (router: express.Router) => {
  router.post("/register", userCreate);
  router.post("/login", userLogin);
  router.get("/me", userAuthenticate, userGetOwn);
  router.get("/user", userAuthenticate, userGet);
  router.get("/users", userAuthenticate, userList);
  router.post("/me/update", userAuthenticate, userUpdateOwn);
  router.post("/user/update", userAuthenticate, userUpdate);
  router.post("/user/delete", userAuthenticate, userDelete);
};
