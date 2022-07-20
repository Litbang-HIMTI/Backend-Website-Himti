import { Router } from "express";
import { validateEditor } from "../../../controllers/auth";
import {
	getAllBlogs,
	getOneBlog,
	createBlog,
	updateBlog,
	deleteBlog,
	getPostRevisions,
	getAllBlogRevisions,
	getOneBlogRevision,
	// createBlogRevision,
	updateBlogRevision,
	deleteBlogRevision,
} from "../../../controllers/blog";

const r = Router();

// * revision protected
r.get("/revision", validateEditor, getAllBlogRevisions);
// r.post("/revision", validateEditor, createBlogRevision); // blog revision is automatically created when a blog is updated
r.get("/revision/:_id", validateEditor, getOneBlogRevision);
r.put("/revision/:_id", validateEditor, updateBlogRevision);
r.delete("/revision/:_id", validateEditor, deleteBlogRevision);

// * public get blog
r.get("/", getAllBlogs);
r.get("/:_id", getOneBlog);

// * protected blog
r.post("/", validateEditor, createBlog);
r.get("/:_id/revision", validateEditor, getPostRevisions);
r.put("/:_id", validateEditor, updateBlog);
r.delete("/:_id", validateEditor, deleteBlog);

export { r as blogRouterV1 };
