import { Response } from "express";
import { ___issue___, ___prod___ } from "../constants";

export const error_500 = (res: Response, err: Error) => {
	return res.status(500).json({
		message: `${err.name}: ${err.message}! If you think that this is a bug, please submit an issue at ${___issue___}`,
		success: false,
		stack: ___prod___ ? undefined : err.stack,
	});
};

export const error_400_id = (res: Response, _id: string, id_type: string) => {
	return res.status(400).json({
		message: `${id_type}: "${_id}" is invalid`,
		success: false,
	});
};
