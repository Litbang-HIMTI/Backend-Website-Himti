import { Response } from "express";
import { ___issue___ } from "../constants";

export const error_500 = (res: Response, error: Error) => {
	return res.status(500).json({
		data: null,
		message: `Server error (${error.name})! If you think that this is a bug, please submit an issue at ${___issue___}`,
		success: false,
	});
};

export const error_400_id = (res: Response, _id: string, id_type: string) => {
	return res.status(400).json({
		data: null,
		message: `${id_type}: "${_id}" is invalid`,
		success: false,
	});
};
