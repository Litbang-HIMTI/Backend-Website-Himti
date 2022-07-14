import { Router } from "express";
import { createUser, getAllUsers, getCertainUser, updateUser, deleteUser } from "../../../controllers/user";

const r = Router();

// TODO: Make authentication so only authenticated users can access these routes. Also some of it must also be restricted to certain roles.
r.get("/", getAllUsers);
r.post("/", createUser);
r.get("/:username", getCertainUser);
r.put("/:username", updateUser);
r.delete("/:username", deleteUser);

export { r as userRouter };
