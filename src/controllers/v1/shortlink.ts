import { Request, Response } from "express";
import { shortLinkModel } from "../../models/shortlink";
import { error_400_id, error_500, ___issue___ } from "../../../src/utils";

// GET
export const getAllShortLinks = async (_req: Request, res: Response) => {
	const shortLinks = await shortLinkModel.find({});
	return res.status(200).json({
		data: shortLinks,
		length: shortLinks.length,
		message: "All custom shortLink retrieved successfully",
		success: true,
	});
};

export const getOneShortLink_public = async (req: Request, res: Response) => {
	const { shorten } = req.params;
	// check if exist
	const shortLink = await shortLinkModel.findOne({ shorten });
	if (!shortLink)
		return res.status(422).json({
			data: null,
			message: `ShortLink "${shorten}" not found`,
			success: false,
		});

	return res.status(200).json({
		data: shortLink,
		message: "ShortLink found and retrieved successfully",
		success: true,
	});
};

// POST
export const createShortLink = async (req: Request, res: Response) => {
	const { url, shorten } = req.body;
	const shortLink = shortLinkModel.create({ url, shorten });
	return res.status(!!shortLink ? 201 : 500).json({
		data: shortLink,
		message: !!shortLink ? "ShortLink created successfully" : `Unable to create shortlink. If you think that this is a bug, please submit an issue at ${___issue___}`,
		success: !!shortLink,
	});
};

// PUT
export const updateShortLink = async (req: Request, res: Response) => {
	const { _id } = req.params;
	const { url } = req.body;
	try {
		const shortLink = await shortLinkModel.findByIdAndUpdate({ _id }, { url }, { runValidators: true, new: true });
		return res.status(!!shortLink ? 200 : 422).json({
			data: shortLink,
			message: !!shortLink ? "ShortLink updated successfully" : `Fail to update. ShortLink _id: "${_id}" not found`,
			success: !!shortLink,
		});
	} catch (error) {
		if (error.name === "CastError") {
			return error_400_id(res, _id, "ShortLink _id");
		} else {
			return error_500(res, error);
		}
	}
};

// DELETE
export const deleteShortLink = async (req: Request, res: Response) => {
	const { _id } = req.params;
	try {
		const shortLink = await shortLinkModel.findByIdAndRemove({ _id });
		return res.status(!!shortLink ? 200 : 422).json({
			data: shortLink,
			message: !!shortLink ? "ShortLink deleted successfully" : `Fail to delete. ShortLink _id: "${_id}" not found`,
			success: !!shortLink,
		});
	} catch (error) {
		if (error.name === "CastError") {
			return error_400_id(res, _id, "ShortLink _id");
		} else {
			return error_500(res, error);
		}
	}
};
