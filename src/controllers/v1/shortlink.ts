import { Request, Response } from "express";
import { shortLinkModel, IShortLinkModel } from "../../models/shortlink";
import { colUser, error_400_id, error_500, unsetAuthorFields, ___issue___ } from "../../utils";

// GET
export const getAllShortLinks = async (req: Request, res: Response) => {
	const count = await shortLinkModel.countDocuments().exec();
	const perPage = parseInt(req.query.perPage as string) || count || 15; // no perPage means get all
	const page = parseInt(req.query.page as string) - 1 || 0;

	const shortLinks = (await shortLinkModel
		.aggregate([
			{ $match: {} },
			{ $sort: { createdAt: -1 } },
			{ $skip: perPage * page },
			{ $limit: perPage },
			{ $lookup: { from: colUser, localField: "author", foreignField: "_id", as: "author" } },
			{ $unset: unsetAuthorFields("author") },
			{ $lookup: { from: colUser, localField: "editedBy", foreignField: "_id", as: "editedBy" } },
			{ $unset: unsetAuthorFields("editedBy") },
		])
		.exec()) as IShortLinkModel[];

	return res.status(200).json({
		data: shortLinks,
		page: page + 1,
		pages: Math.ceil(count / perPage),
		message: "All custom shortLink retrieved successfully",
		success: true,
	});
};

export const getOneShortLink_public = async (req: Request, res: Response) => {
	const { shorten } = req.params;
	// get GET parameter
	const { updateClick } = req.query;
	if (!shorten) return res.status(400).json({ data: null, message: "Invalid parameter", success: false });

	if (parseInt(updateClick as string) === 1) {
		const shortLink = await shortLinkModel.findOneAndUpdate({ shorten }, { $inc: { clickCount: 1 } }, { new: true });
		if (!shortLink) return res.status(422).json({ data: null, message: `ShortLink "${shorten}" not found`, success: false });

		return res.status(200).json({
			data: shortLink,
			message: "ShortLink found and updated successfully",
			success: true,
		});
	} else {
		const shortLink = await shortLinkModel.findOne({ shorten });
		if (!shortLink) return res.status(422).json({ data: null, message: `ShortLink "${shorten}" not found`, success: false });

		return res.status(200).json({
			data: shortLink,
			message: "ShortLink found and retrieved successfully",
			success: true,
		});
	}
};

export const clickCountsOnly = async (_req: Request, res: Response) => {
	// sum all clickCounts
	const clickCounts = await shortLinkModel.aggregate([{ $match: {} }, { $group: { _id: null, clickCount: { $sum: "$clickCount" } } }]).exec();
	return res.status(200).json({
		data: clickCounts[0],
		message: "Click counts sum retrieved successfully",
		success: true,
	});
};

export const getShortlinkStats = async (_req: Request, res: Response) => {
	const stats = await shortLinkModel.collection.stats();
	return res.status(200).json({
		data: stats,
		message: "Shortlink stats retrieved successfully",
		success: true,
	});
};

// POST
export const createShortLink = async (req: Request, res: Response) => {
	const { url, shorten } = req.body;
	const shortLink = await shortLinkModel.create({ author: req.session.userId!, url, shorten });
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
		const shortLink = await shortLinkModel.findByIdAndUpdate({ _id }, { url, editedBy: req.session.userId }, { runValidators: true, new: true });
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
