import { Router } from "express";
import { getAllGroups, getCertainGroup, createGroup, updateGroup, deleteGroup } from "../../../controllers/group";

const r = Router();

r.get("/", getAllGroups);
r.post("/", createGroup);
r.get("/:groupname", getCertainGroup);
r.put("/:groupname", updateGroup);
r.delete("/:groupname", deleteGroup);

export { r as groupRouter };
