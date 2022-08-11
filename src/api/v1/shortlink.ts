import { Router } from "express";
import { validateShortlinkMod, validateStaff } from "../../controllers/v1/auth";
import { getAllShortLinks, getOneShortLink_public, createShortLink, updateShortLink, deleteShortLink, getShortlinkStats, clickCountsOnly } from "../../controllers/v1/shortlink";

const r = Router();

// * staff dashboard
r.get("/stats", validateStaff, getShortlinkStats);
r.get("/clickCounts", validateStaff, clickCountsOnly);

// * Public
r.get("/:shorten", getOneShortLink_public); // ? query option: ?updateClick=1

// * Protected shortlinkmod only
r.use(validateShortlinkMod);

r.get("/", getAllShortLinks);
r.post("/", createShortLink);
r.put("/:_id", updateShortLink);
r.delete("/:_id", deleteShortLink);

export { r as shortlinkRouterV1 };
