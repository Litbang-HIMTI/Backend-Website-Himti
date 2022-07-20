import { NextFunction, Request, Response } from "express";

const ExpressErrorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
	/* eslint-enable no-unused-vars */
	const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
	res.status(statusCode);
	res.json({
		message: err.message + "\n\n" + "If you think that this is a bug, please submit an issue at https://github.com/Litbang-HIMTI/Backend-Website-Himti/issues",
		success: false,
		stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
	});
};

export { ExpressErrorHandler };
