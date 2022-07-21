import { Router } from "express";
import { validateForumMod } from "../../controllers/v1/auth";
import { getAllComments, getCommentByAuthor, getCommentByForumId, createComment, updateComment, deleteComment } from "../../controllers/v1/comment";

const r = Router();

// * public
r.get("/forum/:_id", getCommentByForumId);
r.get("/author/:authorId", getCommentByAuthor);

// * protected forummod only
r.use(validateForumMod);
r.get("/", getAllComments);
r.post("/", createComment);
r.put("/:_id", updateComment);
r.delete("/:_id", deleteComment);

export { r as commentRouterV1 };
