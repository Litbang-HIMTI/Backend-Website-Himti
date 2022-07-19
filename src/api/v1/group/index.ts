import { Router } from "express";
import { validateAdmin } from "../../../controllers/auth";
import { getAllGroups, getOneGroup_public, getOneGroup_protected, createGroup, updateGroup, deleteGroup } from "../../../controllers/group";

const r = Router();

// * Public
r.get("/:groupname", getOneGroup_public);

// * Protected admin only
r.use(validateAdmin);

// GET
r.get("/", getAllGroups);
r.get("/:groupname/admin", getOneGroup_protected);

// POST
r.post("/", createGroup);

// PUT
r.put("/:groupname", updateGroup);

// DELETE
r.delete("/:groupname", deleteGroup);

export { r as groupRouterV1 };
