import { NextFunction, Request, Response } from "express";
import { ___prod___ } from "./constants";

const badRequestName = ["ValidationError", "CastError"];
const badRequestMessage = ["Argument passed"];
const ExpressErrorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
	const statusCode = res.statusCode !== 200 ? res.statusCode : badRequestName.includes(err.name) || badRequestMessage.some((subString) => err.message.includes(subString)) ? 400 : 500;
	const dataErr: any = {
		data: null,
		message: `${err.name}: ${err.message}` + " If you think that this is a bug, please submit an issue at https://github.com/Litbang-HIMTI/Backend-Website-Himti/issues",
		success: false,
		stack: ___prod___ ? undefined : err.stack,
	};
	return res.status(statusCode).json(dataErr);
};

export { ExpressErrorHandler };
