import { Router } from "express";
import { validateForumMod, validateStaff } from "../../controllers/v1/auth";
import * as cForum from "../../controllers/v1/forum";

const r = Router();

// * staff dashboard
r.get("/stats", validateStaff, cForum.getForumStats);

// * public
r.get("/", cForum.getAllForums); // ? query option: ?category=name
r.get("/:_id", cForum.getOneForum);
r.get("/:_id/full", cForum.getOneForumAndItsComments);

// * protected forummod only
r.use(validateForumMod);
r.post("/", cForum.createForum);
r.put("/:_id", cForum.updateForum);
r.delete("/:_id", cForum.deleteForum);

export { r as forumRouterV1 };
