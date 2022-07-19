import { Router } from "express";
import { validateAdmin } from "../../../controllers/auth";
import { getAllGroups, getCertainGroup_public, getCertainGroup_admin, createGroup, updateGroup, deleteGroup } from "../../../controllers/group";

const r = Router();

r.get("/:groupname", getCertainGroup_public);

// * Protected admin only
r.use(validateAdmin);
r.get("/", getAllGroups);
r.post("/", createGroup);
r.get("/:groupname/admin", getCertainGroup_admin);
r.put("/:groupname", updateGroup);
r.delete("/:groupname", deleteGroup);

export { r as groupRouterV1 };
