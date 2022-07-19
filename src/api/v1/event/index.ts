import { Router } from "express";
import { validateAdmin } from "../../../controllers/auth";
import { getAllEvents, getOneEvent, createEvent, updateEvent, deleteEvent } from "../../../controllers/event";

const r = Router();
// * Public
r.get("/", getAllEvents);
r.get("/:_id", getOneEvent);

// * Protected admin only
r.use(validateAdmin);
r.post("/", createEvent);
r.put("/:_id", updateEvent);
r.delete("/:_id", deleteEvent);

export { r as eventRouterV1 };
