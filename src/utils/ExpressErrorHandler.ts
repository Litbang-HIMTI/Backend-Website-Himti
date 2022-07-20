import { NextFunction, Request, Response } from "express";
import { ___prod___ } from "./constants";

const ExpressErrorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
	/* eslint-enable no-unused-vars */
	const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
	res.status(statusCode);
	res.json({
		message: err.message + ". If you think that this is a bug, please submit an issue at https://github.com/Litbang-HIMTI/Backend-Website-Himti/issues",
		success: false,
		stack: ___prod___ ? "🥞" : err.stack,
	});
};

export { ExpressErrorHandler };
