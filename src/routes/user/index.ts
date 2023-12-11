import express from "express";

import { userCreate } from "./UserCreate";
import { userGet } from "./UserGet";

const router = express.Router();

router.get("/:id", userGet);
router.post("/register", userCreate);

export const UserController = router;
