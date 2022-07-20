import { Router } from "express";
import { validateEditor } from "../../../controllers/auth";
import * as cBlog from "../../../controllers/blog";

const r = Router();

// * revision protected
// * Revision is automatically created when a blog post is updated
r.get("/revision", validateEditor, cBlog.getAllBlogRevisions);
r.get("/revision/:_id", validateEditor, cBlog.getOneBlogRevision);
r.put("/revision/:_id", validateEditor, cBlog.updateBlogRevision);
r.delete("/revision/:_id", validateEditor, cBlog.deleteBlogRevision);

// * public get blog
r.get("/", cBlog.getAllBlogs);
r.get("/:_id", cBlog.getOneBlog);

// * protected editor only
r.use(validateEditor);
r.post("/", cBlog.createBlog);
r.get("/:_id/revision", cBlog.getBlogRevisionsByBlogId);
r.put("/:_id", cBlog.updateBlog);
r.delete("/:_id", cBlog.deleteBlog);

export { r as blogRouterV1 };
