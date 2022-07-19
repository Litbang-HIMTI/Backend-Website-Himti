import { Router } from "express";
import { validateAdmin } from "../../../controllers/auth";
import { createUser, getAllUsers, getCertainUser_public, getCertainUser_admin, updateUserData, changePassword, deleteUser } from "../../../controllers/user";

const r = Router();

r.get("/:username", getCertainUser_public);

// * Protected admin only
r.use(validateAdmin);
r.get("/", getAllUsers);
r.post("/", createUser); // ! register only allowed for admin for now
r.get("/:username/admin", getCertainUser_admin);
r.put("/:username", updateUserData);
r.put("/:username/password", changePassword);
r.delete("/:username", deleteUser);

export { r as userRouterV1 };
