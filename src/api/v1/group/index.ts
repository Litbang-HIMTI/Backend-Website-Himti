import { Router } from "express";
import { validateAdmin } from "../../../controllers/auth";
import { getAllGroups, getCertainGroup, createGroup, updateGroup, deleteGroup } from "../../../controllers/group";

const r = Router();

r.use(validateAdmin);
r.get("/", getAllGroups);
r.post("/", createGroup);
r.get("/:groupname", getCertainGroup);
r.put("/:groupname", updateGroup);
r.delete("/:groupname", deleteGroup);

export { r as groupRouterV1 };
