import { Router } from "express";
import { validateAdmin } from "../../../controllers/auth";
import { createUser, getAllUsers, getCertainUserPublic, getCertainUserPrivate, updateUserData, changePassword, deleteUser } from "../../../controllers/user";

const r = Router();

r.get("/:username", getCertainUserPublic);

r.use(validateAdmin);
r.get("/", getAllUsers);
r.post("/", createUser); // ! register only allowed for admin for now
r.get("/:username/admin", getCertainUserPrivate);
r.put("/:username", updateUserData);
r.put("/:username/password", changePassword);
r.delete("/:username", deleteUser);

export { r as userRouterV1 };
