import { Response } from "express";
import { ___issue___, ___prod___ } from "../constants";

const badRequestName = ["ValidationError", "CastError"];
const badRequestMessage = ["Argument passed", "Expected a positive"];
export const getDataStatus = (res: Response, err: Error) => {
	const statusCode = res.statusCode !== 200 ? res.statusCode : badRequestName.includes(err.name) || badRequestMessage.some((subString) => err.message.includes(subString)) ? 400 : 500;
	const dataErr: any = {
		message: `${err.name}: ${err.message}!` + " If you think that this is a bug, please submit an issue at https://github.com/Litbang-HIMTI/Backend-Website-Himti/issues",
		success: false,
		stack: ___prod___ ? undefined : err.stack,
	};
	return { statusCode, dataErr };
};

export const error_500 = (res: Response, err: Error) => {
	const { statusCode, dataErr } = getDataStatus(res, err);
	res.status(statusCode).json(dataErr);
};

export const error_400_id = (res: Response, _id: string, id_type: string) => {
	res.status(400).json({
		message: `${id_type}: "${_id}" is invalid`,
		success: false,
	});
};
