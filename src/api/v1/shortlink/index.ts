import { Router } from "express";
import { validateAdmin } from "../../../controllers/auth";
import { getAllShortLinks, getOneShortLink_public, createShortLink, updateShortLink, deleteShortLink } from "../../../controllers/shortlink";

const r = Router();

// * Public
r.get("/:shorten", getOneShortLink_public);

// * Protected admin only
r.use(validateAdmin);

r.get("/", getAllShortLinks);
r.post("/", createShortLink);
r.put("/:shorten", updateShortLink);
r.delete("/:shorten", deleteShortLink);

export { r as shortlinkRouterV1 };
