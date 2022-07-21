import { Request, Response } from "express";
import { Types } from "mongoose";
import { ___issue___ } from "../../utils/constants";
import { colComment } from "../../utils/constants";
import { forumModel, forumCategoryModel } from "../../models/forum";
import { commentModel } from "../../models/comment";

// --------------------------------------------------------------------------------------------
// FORUM
// GET
export const getAllForums = async (_req: Request, res: Response) => {
	const forums = await forumModel.find({});
	return res.status(200).json({
		data: forums,
		length: forums.length,
		message: "Forums retrieved successfully",
		success: true,
	});
};

export const getOneForum = async (req: Request, res: Response) => {
	const { _id } = req.params;
	try {
		const forum = await forumModel.findById(_id);

		return res.status(200).json({
			data: forum,
			message: !!forum ? "Forum retrieved successfully" : `Forum _id: "${_id}" not found`,
			success: !!forum,
		});
	} catch (error) {
		if (error.name === "CastError") {
			return res.status(400).json({
				data: null,
				message: `_id: "${_id}" is invalid`,
				success: false,
			});
		} else {
			return res.status(500).json({
				data: null,
				message: `Server error (${error.name})! If you think that this is a bug, please submit an issue at ${___issue___}`,
				success: false,
			});
		}
	}
};

export const getOneForumAndItsComments = async (req: Request, res: Response) => {
	const { _id } = req.params;
	const mId = Types.ObjectId(_id);
	const forum = await forumModel
		.aggregate([{ $match: { _id: mId } }, { $lookup: { from: colComment, localField: "_id", foreignField: "forumId", as: "comments" } }, { $unset: ["comments.forumId"] }])
		.exec();

	console.log(forum);

	if (forum.length === 0)
		return res.status(200).json({
			data: null,
			message: `Forum _id: "${_id}" not found`,
			success: false,
		});

	return res.status(200).json({
		data: forum[0],
		message: `Forum _id: "${_id}" retrieved successfully`,
		success: true,
	});
};

export const getForumsByCategoryName = async (req: Request, res: Response) => {
	const { name } = req.params;
	try {
		const forums = await forumModel.find({ category: name });

		return res.status(200).json({
			data: forums,
			length: forums.length,
			message: "Forums retrieved successfully",
			success: true,
		});
	} catch (error) {
		if (error.name === "CastError") {
			return res.status(400).json({
				data: null,
				message: `Forum category: "${name}" not found`,
				success: false,
			});
		} else {
			return res.status(500).json({
				data: null,
				message: `Server error (${error.name})! If you think that this is a bug, please submit an issue at ${___issue___}`,
				success: false,
			});
		}
	}
};

// POST
export const createForum = async (req: Request, res: Response) => {
	const forum = await forumModel.create({ ...req.body, author: req.session.userId });

	return res.status(!!forum ? 201 : 200).json({
		data: forum,
		message: !!forum ? "Forum post created successfully" : "Fail to create forum post",
		success: !!forum,
	});
};

// PUT
export const updateForum = async (req: Request, res: Response) => {
	const { _id } = req.params;
	try {
		const forum = await forumModel.findByIdAndUpdate(_id, { ...req.body, updatedBy: req.session.userId }, { new: true });

		return res.status(200).json({
			data: forum,
			message: !!forum ? "Forum updated successfully" : `Fail to update forum _id: "${_id}" not found`,
			success: !!forum,
		});
	} catch (error) {
		if (error.name === "CastError") {
			return res.status(400).json({
				data: null,
				message: `_id: "${_id}" is invalid`,
				success: false,
			});
		} else {
			return res.status(500).json({
				data: null,
				message: `Server error (${error.name})! If you think that this is a bug, please submit an issue at ${___issue___}`,
				success: false,
			});
		}
	}
};

// DELETE
export const deleteForum = async (req: Request, res: Response) => {
	const { _id } = req.params;
	try {
		const forum = await forumModel.findByIdAndDelete(_id);
		// delete its comments
		const { deletedCount, ok } = await commentModel.deleteMany({ forumId: _id });

		return res.status(200).json({
			data: forum,
			message: !!forum
				? `Successfully deleted forum post ${ok ? ` and its comments (Got ${deletedCount} deleted)` : " and fail to delete its comments (Operations failed)"}`
				: `Fail to delete forum _id: "${_id}" not found`,
			success: !!forum,
		});
	} catch (error) {
		if (error.name === "CastError") {
			return res.status(400).json({
				data: null,
				message: `_id: "${_id}" is invalid`,
				success: false,
			});
		} else {
			return res.status(500).json({
				data: null,
				message: `Server error (${error.name})! If you think that this is a bug, please submit an issue at ${___issue___}`,
				success: false,
			});
		}
	}
};

// --------------------------------------------------------------------------------------------
// FORUM CATEGORY
// GET
export const getAllForumCategories = async (_req: Request, res: Response) => {
	const categories = await forumCategoryModel.find({});
	return res.status(200).json({
		data: categories,
		length: categories.length,
		message: "Forum categories retrieved successfully",
		success: true,
	});
};

export const getOneForumCategory = async (req: Request, res: Response) => {
	const { name } = req.params;
	const category = await forumCategoryModel.findOne({ name });

	return res.status(200).json({
		data: category,
		message: !!category ? "Forum category retrieved successfully" : `Forum category name: "${name}" not found`,
		success: !!category,
	});
};

// POST
export const createForumCategory = async (req: Request, res: Response) => {
	const category = await forumCategoryModel.create({ ...req.body });

	return res.status(!!category ? 201 : 200).json({
		data: category,
		message: !!category ? "Forum category created successfully" : "Fail to create forum category",
		success: !!category,
	});
};

// PUT
export const updateForumCategory = async (req: Request, res: Response) => {
	const { _id } = req.params;

	try {
		const category = await forumCategoryModel.findByIdAndUpdate(_id, { ...req.body }, { new: true });

		return res.status(200).json({
			data: category,
			message: !!category ? "Forum category updated successfully" : `Fail to update forum category _id: "${_id}" not found`,
			success: !!category,
		});
	} catch (error) {
		if (error.name === "CastError") {
			return res.status(400).json({
				data: null,
				message: `_id: "${_id}" is invalid`,
				success: false,
			});
		} else {
			return res.status(500).json({
				data: null,
				message: `Server error (${error.name})! If you think that this is a bug, please submit an issue at ${___issue___}`,
				success: false,
			});
		}
	}
};

// DELETE
export const deleteForumCategory = async (req: Request, res: Response) => {
	const { _id } = req.params;
	try {
		const category = await forumCategoryModel.findByIdAndRemove(_id);

		return res.status(200).json({
			data: category,
			message: !!category ? "Forum category deleted successfully" : `Fail to delete forum category _id: "${_id}" not found`,
			success: !!category,
		});
	} catch (error) {
		if (error.name === "CastError") {
			return res.status(400).json({
				data: null,
				message: `_id: "${_id}" is invalid`,
				success: false,
			});
		} else {
			return res.status(500).json({
				data: null,
				message: `Server error (${error.name})! If you think that this is a bug, please submit an issue at ${___issue___}`,
				success: false,
			});
		}
	}
};
