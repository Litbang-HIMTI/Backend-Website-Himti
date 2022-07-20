import { NextFunction, Request, Response } from "express";
import { ___prod___ } from "./constants";

const badRequestErrList = ["ValidationError", "CastError"];
const ExpressErrorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
	const statusCode = res.statusCode !== 200 ? res.statusCode : badRequestErrList.includes(err.name) ? 400 : 500;
	res.status(statusCode).json({
		data: null,
		message: `${err.name}: ${err.message}` + " If you think that this is a bug, please submit an issue at https://github.com/Litbang-HIMTI/Backend-Website-Himti/issues",
		success: false,
		stack: ___prod___ ? "🥞" : err.stack,
	});
};

export { ExpressErrorHandler };
