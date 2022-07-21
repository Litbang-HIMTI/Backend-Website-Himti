import { Request, Response } from "express";
import { shortLinkModel } from "../../models/shortlink";

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
		return res.status(200).json({
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
	return res.status(!!shortLink ? 201 : 200).json({
		data: shortLink,
		message: !!shortLink ? "ShortLink created successfully" : "Fail to create shortLink",
		success: !!shortLink,
	});
};

// PUT
export const updateShortLink = async (req: Request, res: Response) => {
	const { shorten } = req.params;
	const { url } = req.body;
	const shortLink = await shortLinkModel.findOneAndUpdate({ shorten }, { url }, { runValidators: true, new: true });
	return res.status(200).json({
		data: shortLink ? shortLink : `ShortLink ${shorten} not found`,
		message: !!shortLink ? "ShortLink updated successfully" : "Fail to update shortLink",
		success: !!shortLink,
	});
};

// DELETE
export const deleteShortLink = async (req: Request, res: Response) => {
	const { shorten } = req.params;
	const shortLink = await shortLinkModel.findOneAndDelete({ shorten });
	return res.status(200).json({
		data: shortLink ? shortLink : `ShortLink ${shorten} not found`,
		message: !!shortLink ? "ShortLink deleted successfully" : "Fail to delete shortLink",
		success: !!shortLink,
	});
};
