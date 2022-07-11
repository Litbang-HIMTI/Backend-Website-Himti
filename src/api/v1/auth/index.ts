import { Router } from "express";

const r = Router();

r.get("/login", (_req, res) => {
	res.json({
		msg: "Hello API",
	});
});

export { r as authRouter };
