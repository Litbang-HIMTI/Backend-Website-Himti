import { Router } from "express";
import { validateEditor, validateStaff } from "../../controllers/v1/auth";
import * as cBlog from "../../controllers/v1/blog";

const r = Router();

// * revision protected
// * revision is automatically created when a blog post is updated
r.get("/revision", validateEditor, cBlog.getAllBlogRevisions); // query blogId to get by eventId
r.get("/revision/:_id", validateEditor, cBlog.getOneBlogRevision);
r.put("/revision/:_id", validateEditor, cBlog.updateBlogRevision);
r.delete("/revision/:_id", validateEditor, cBlog.deleteBlogRevision);

// * staff dashboard
r.get("/admin", validateStaff, cBlog.getAllBlogsAdmin);
r.get("/stats", validateStaff, cBlog.getPostStats);

// * public get blog
r.get("/tags", cBlog.getTagsOnly);
r.get("/", cBlog.getAllBlogsPublic);
r.get("/:_id", cBlog.getOneBlog);
r.get("/:_id/full", cBlog.getOneBlogAndItsComments);
r.put("/:_id/like", cBlog.likeBlog);

// * protected editor only
r.use(validateEditor);
r.post("/", cBlog.createBlog);
r.get("/:_id/revision", cBlog.getBlogRevisionsByBlogId);
r.put("/:_id", cBlog.updateBlog);
r.delete("/:_id", cBlog.deleteBlog);

export { r as blogRouterV1 };
