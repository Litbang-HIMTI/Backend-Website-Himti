import { Router } from "express";
import { validateAdmin } from "../../controllers/v1/auth";
import { getAllGroups, getOneGroup_public, getOneGroup_protected, createGroup, updateGroup, deleteGroup } from "../../controllers/v1/group";

const r = Router();

// * Public
r.get("/:_id", getOneGroup_public);

// * Protected admin only
r.use(validateAdmin);

r.get("/", getAllGroups);
r.post("/", createGroup);
r.get("/:_id/admin", getOneGroup_protected);
r.put("/:_id", updateGroup);
r.delete("/:_id", deleteGroup);

export { r as groupRouterV1 };
