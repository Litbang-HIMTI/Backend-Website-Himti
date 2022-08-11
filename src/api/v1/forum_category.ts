import { Router } from "express";
import { validateForumMod } from "../../controllers/v1/auth";
import * as cForumCategory from "../../controllers/v1/forum_category";

const r = Router();

// * public
r.get("/", cForumCategory.getAllForumCategories);
r.get("/:name", cForumCategory.getOneForumCategory);

// * protected forummod only
r.use(validateForumMod);
r.post("/", cForumCategory.createForumCategory);
r.put("/:_id", cForumCategory.updateForumCategory);
r.delete("/:_id", cForumCategory.deleteForumCategory);

export { r as forumCategoryRouterV1 };
