import { Router } from "express";
import { createUser, getAllUsers } from "../../../controllers/user";

const r = Router();

r.get("/", getAllUsers);
r.post("/", createUser);

export { r as userRouter };
