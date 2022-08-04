import { Router } from "express";
import { validateEditor } from "../../controllers/v1/auth";
import * as cEvent from "../../controllers/v1/event";

const r = Router();
// * revision protected
// * revision is automatically created when an event is updated
r.get("/revision", validateEditor, cEvent.getAllEventRevisions); // query eventId to get by eventId
r.get("/revision/:_id", validateEditor, cEvent.getOneEventRevision);
r.put("/revision/:_id", validateEditor, cEvent.updateEventRevision);
r.delete("/revision/:_id", validateEditor, cEvent.deleteEventRevision);

// * Public
r.get("/", cEvent.getAllEvents);
r.get("/:_id", cEvent.getOneEvent);

// * Protected editor only
r.use(validateEditor);
r.post("/", cEvent.createEvent);
r.get("/:_id/revision", cEvent.getEventRevisionsByEventId);
r.put("/:_id", cEvent.updateEvent);
r.delete("/:_id", cEvent.deleteEvent);

export { r as eventRouterV1 };
