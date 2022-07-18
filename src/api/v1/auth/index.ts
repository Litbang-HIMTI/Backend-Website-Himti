import { Router } from "express";
import rateLimit from "express-rate-limit";
import { login, logout, check } from "../../../controllers/auth";

const limiter = rateLimit({
	windowMs: 10 * 60 * 1000, // 10 minutes
	max: 25, // Limit each IP to 25 requests per `window` (here, per 10 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const r = Router();

r.get("/", check);
r.post("/", limiter, login);
r.delete("/", logout);
// register is in user controller

export { r as authRouterV1 };
