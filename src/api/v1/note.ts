import { Router } from "express";
import { validateStaff } from "../../controllers/v1/auth";
import { getAllNotes, getOneNote, createNote, updateNote, deleteNote } from "../../controllers/v1/note";

const r = Router();

// * Protected admin only
r.use(validateStaff);

r.get("/", getAllNotes);
r.post("/", createNote);
r.get("/:_id", getOneNote);
r.put("/:_id", updateNote);
r.delete("/:_id", deleteNote);

export { r as noteRouterV1 };
