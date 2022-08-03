import { Request, Response } from "express";
import { Types } from "mongoose";
import { forumModel, forumCategoryModel, IForumModel, IForumCategoryModel } from "../../models/forum";
import { commentModel } from "../../models/comment";
import { error_400_id, error_500, colComment, ___issue___, colUser, unsetAuthorFields, colForumCategory } from "../../utils";

// --------------------------------------------------------------------------------------------
// FORUM
// GET
export const getAllForums = async (req: Request, res: Response) => {
	const { category } = req.query;
	const count = await forumModel.countDocuments().exec();
	const perPage = parseInt(req.query.perPage as string) || count || 15; // no perPage means get all
	const page = parseInt(req.query.page as string) - 1 || 0;

	let forums;
	if (category) {
		forums = (await forumModel
			.aggregate([
				{ $match: { category: category } },
				{ $sort: { createdAt: -1 } },
				{ $skip: perPage * page },
				{ $limit: perPage },
				{ $lookup: { from: colForumCategory, localField: "category", foreignField: "_id", as: "category" } },
				{ $lookup: { from: colUser, localField: "author", foreignField: "_id", as: "author" } },
				{ $unset: unsetAuthorFields("author") },
			])
			.exec()) as IForumModel[];

		if (forums.length === 0) return res.status(422).json({ data: null, message: `Forum posts by category: "${category}" not found`, success: false });
	} else {
		forums = (await forumModel
			.aggregate([
				{ $match: {} },
				{ $sort: { createdAt: -1 } },
				{ $skip: perPage * page },
				{ $limit: perPage },
				{ $lookup: { from: colForumCategory, localField: "category", foreignField: "_id", as: "category" } },
				{ $lookup: { from: colUser, localField: "author", foreignField: "_id", as: "author" } },
				{ $unset: unsetAuthorFields("author") },
			])
			.exec()) as IForumModel[];
	}

	return res.status(200).json({
		data: forums,
		page: page + 1,
		pages: Math.ceil(count / perPage),
		message: category ? `Forum posts  by category: "${category}" retrieved successfully` : "Forums retrieved successfully",
		success: true,
	});
};

export const getOneForum = async (req: Request, res: Response) => {
	const { _id } = req.params;
	try {
		const forum = (
			await forumModel
				.aggregate([
					{ $match: { _id: Types.ObjectId(_id) } },
					{ $lookup: { from: colForumCategory, localField: "category", foreignField: "_id", as: "category" } },
					{ $lookup: { from: colUser, localField: "author", foreignField: "_id", as: "author" } },
					{ $unset: unsetAuthorFields("author") },
				])
				.exec()
		)[0] as IForumModel;

		return res.status(!!forum ? 200 : 422).json({
			data: forum,
			message: !!forum ? "Forum retrieved successfully" : `Forum _id: "${_id}" not found`,
			success: !!forum,
		});
	} catch (error) {
		if (error.name === "CastError") {
			return error_400_id(res, _id, "Forum _id");
		} else {
			return error_500(res, error);
		}
	}
};

export const getOneForumAndItsComments = async (req: Request, res: Response) => {
	const { _id } = req.params;
	try {
		const forum = (await forumModel
			.aggregate([
				{ $match: { _id: Types.ObjectId(_id) } },
				{ $lookup: { from: colForumCategory, localField: "category", foreignField: "_id", as: "category" } },
				{ $lookup: { from: colUser, localField: "author", foreignField: "_id", as: "author" } },
				{ $unset: unsetAuthorFields("author") },
				{ $lookup: { from: colComment, localField: "_id", foreignField: "forumId", as: "comments" } },
				{ $unset: ["comments.forumId"] },
			])
			.exec()) as IForumModel[];

		if (forum.length === 0)
			return res.status(422).json({
				data: null,
				message: `Forum _id: "${_id}" not found`,
				success: false,
			});

		return res.status(200).json({
			data: forum[0],
			message: `Forum _id: "${_id}" retrieved successfully`,
			success: true,
		});
	} catch (error) {
		if (error.name === "CastError") {
			return error_400_id(res, _id, "Forum _id");
		} else {
			return error_500(res, error);
		}
	}
};

// POST
export const createForum = async (req: Request, res: Response) => {
	const forum = await forumModel.create({ ...req.body, author: req.session.userId });
	return res.status(!!forum ? 201 : 500).json({
		data: forum,
		message: !!forum ? "Forum post created successfully" : `Unable to create forum post. If you think that this is a bug, please submit an issue at ${___issue___}`,
		success: !!forum,
	});
};

// PUT
export const updateForum = async (req: Request, res: Response) => {
	const { _id } = req.params;
	try {
		const forum = await forumModel.findByIdAndUpdate(_id, { ...req.body, updatedBy: req.session.userId }, { new: true, runValidators: true });
		return res.status(!!forum ? 200 : 422).json({
			data: forum,
			message: !!forum ? "Forum updated successfully" : `Fail to update. Forum _id: "${_id}" not found`,
			success: !!forum,
		});
	} catch (error) {
		if (error.name === "CastError") {
			return error_400_id(res, _id, "Forum _id");
		} else {
			return error_500(res, error);
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

		return res.status(!forum ? 200 : 422).json({
			data: forum,
			message: !!forum
				? `Successfully deleted forum post ${ok ? ` and its comments (Got ${deletedCount} deleted)` : " and fail to delete its comments (Operations failed)"}`
				: `Fail to delete forum _id: "${_id}" not found`,
			success: !!forum,
		});
	} catch (error) {
		if (error.name === "CastError") {
			return error_400_id(res, _id, "Forum _id");
		} else {
			return error_500(res, error);
		}
	}
};

// --------------------------------------------------------------------------------------------
// FORUM CATEGORY
// GET
export const getAllForumCategories = async (req: Request, res: Response) => {
	const count = await forumModel.countDocuments().exec();
	const perPage = parseInt(req.query.perPage as string) || count || 15; // no perPage means get all
	const page = parseInt(req.query.page as string) - 1 || 0;

	const categories = (await forumCategoryModel.aggregate([{ $match: {} }, { $sort: { createdAt: -1 } }, { $skip: perPage * page }, { $limit: perPage }]).exec()) as IForumCategoryModel[];

	return res.status(200).json({
		data: categories,
		page: page + 1,
		pages: Math.ceil(count / perPage),
		message: "Forum categories retrieved successfully",
		success: true,
	});
};

export const getOneForumCategory = async (req: Request, res: Response) => {
	const { name } = req.params;
	const category = await forumCategoryModel.findOne({ name });

	return res.status(!!category ? 200 : 422).json({
		data: category,
		message: !!category ? "Forum category retrieved successfully" : `Forum category name: "${name}" not found`,
		success: !!category,
	});
};

// POST
export const createForumCategory = async (req: Request, res: Response) => {
	const category = await forumCategoryModel.create({ ...req.body });
	return res.status(!!category ? 201 : 500).json({
		data: category,
		message: !!category ? "Forum category created successfully" : `Unable to create forum category. If you think that this is a bug, please submit an issue at ${___issue___}`,
		success: !!category,
	});
};

// PUT
export const updateForumCategory = async (req: Request, res: Response) => {
	const { _id } = req.params;

	try {
		const category = await forumCategoryModel.findByIdAndUpdate(_id, { ...req.body }, { new: true, runValidators: true });
		return res.status(!!category ? 201 : 422).json({
			data: category,
			message: !!category ? "Forum category updated successfully" : `Fail to update. Forum category _id: "${_id}" not found`,
			success: !!category,
		});
	} catch (error) {
		if (error.name === "CastError") {
			return error_400_id(res, _id, "Forum category _id");
		} else {
			return error_500(res, error);
		}
	}
};

// DELETE
export const deleteForumCategory = async (req: Request, res: Response) => {
	const { _id } = req.params;
	try {
		const category = await forumCategoryModel.findByIdAndRemove(_id);

		return res.status(!!category ? 201 : 422).json({
			data: category,
			message: !!category ? "Forum category deleted successfully" : `Fail to delete. Forum category _id: "${_id}" not found`,
			success: !!category,
		});
	} catch (error) {
		if (error.name === "CastError") {
			return error_400_id(res, _id, "Forum category _id");
		} else {
			return error_500(res, error);
		}
	}
};
