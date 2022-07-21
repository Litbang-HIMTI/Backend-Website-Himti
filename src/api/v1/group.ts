import { Router } from "express";
import { validateAdmin } from "../../controllers/v1/auth";
import { getAllGroups, getOneGroup_public, getOneGroup_protected, createGroup, updateGroup, deleteGroup } from "../../controllers/v1/group";

const r = Router();

// * Public
r.get("/:groupname", getOneGroup_public);

// * Protected admin only
r.use(validateAdmin);

r.get("/", getAllGroups);
r.post("/", createGroup);
r.get("/:groupname/admin", getOneGroup_protected);
r.put("/:groupname", updateGroup);
r.delete("/:groupname", deleteGroup);

export { r as groupRouterV1 };
