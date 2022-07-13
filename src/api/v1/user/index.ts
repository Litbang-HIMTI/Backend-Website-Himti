import { Router } from "express";
import { createUser, getAllUsers, updateUser, deleteUser } from "../../../controllers/user";

const r = Router();

// TODO: User API Routes must be protected. Only authenticated users can access these routes.
r.get("/", getAllUsers);
r.post("/", createUser);
r.put("/:username", updateUser);
r.delete("/:username", deleteUser);

export { r as userRouter };
