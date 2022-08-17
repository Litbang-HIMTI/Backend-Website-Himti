import { Router } from "express";
import { validateAdmin } from "../../controllers/v1/auth";
import { createUser, getAllUsers, getOneUser_public, getOneUser_protected, updateUserData, changePassword, deleteUser } from "../../controllers/v1/user";

const r = Router();

// * Public
r.get("/:username", getOneUser_public);

// * Protected admin only
r.use(validateAdmin);

r.get("/", getAllUsers);
r.post("/", createUser); // ! register only allowed for admin for now
r.put("/:_id", updateUserData);
r.delete("/:_id", deleteUser);
r.put("/:_id/password", changePassword);
r.get("/:_id/admin", getOneUser_protected);

export { r as userRouterV1 };
