import { Router } from "express";
import { validateEditor, validateStaff } from "../../controllers/v1/auth";
import * as cEvent from "../../controllers/v1/event";

const r = Router();
// * revision protected
// * revision is automatically created when an event is updated
r.get("/revision", validateEditor, cEvent.getAllEventRevisions); // query eventId to get by eventId
r.get("/revision/:_id", validateEditor, cEvent.getOneEventRevision);
r.put("/revision/:_id", validateEditor, cEvent.updateEventRevision);
r.delete("/revision/:_id", validateEditor, cEvent.deleteEventRevision);

// * staff dashboard
r.get("/admin", validateStaff, cEvent.getAllEventsAdmin);
r.get("/stats", validateStaff, cEvent.getEventStats);

// * Public
r.get("/tags", cEvent.getTagsOnly);
r.get("/organizer", cEvent.getOrganizerOnly);
r.get("/", cEvent.getAllEventsPublic);
r.get("/:_id", cEvent.getOneEvent);
r.get("/:_id/full", cEvent.getOneEventAndItsComments);

// * Protected editor only
r.use(validateEditor);
r.post("/", cEvent.createEvent);
r.get("/:_id/revision", cEvent.getEventRevisionsByEventId);
r.put("/:_id", cEvent.updateEvent);
r.delete("/:_id", cEvent.deleteEvent);

export { r as eventRouterV1 };
