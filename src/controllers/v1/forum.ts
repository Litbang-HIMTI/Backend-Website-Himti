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
	const content = req.query.content === "1";

	const aggregations: any[] = [
		{ $sort: { createdAt: -1 } },
		{ $skip: perPage * page },
		{ $limit: perPage },
		{ $lookup: { from: colForumCategory, localField: "category", foreignField: "_id", as: "category" } },
		{ $lookup: { from: colUser, localField: "author", foreignField: "_id", as: "author" } },
		{ $unset: unsetAuthorFields("author") },
		{ $lookup: { from: colUser, localField: "editedBy", foreignField: "_id", as: "editedBy" } },
		{ $unset: unsetAuthorFields("editedBy") },
		{ $unset: ["content"] },
	];
	if (content) aggregations.pop(); // remove unset content so we can get the content

	let forums;
	if (category) {
		// first fetch category to get the id from the name
		const categoryId = (await forumCategoryModel.findOne({ name: category }).exec()) as IForumCategoryModel;
		if (!categoryId) return res.status(422).json({ message: `Category "${category}" not found`, success: false });

		aggregations.unshift({ $match: { category: categoryId._id } });
		forums = (await forumModel.aggregate(aggregations).exec()) as IForumModel[];

		if (forums.length === 0) return res.status(422).json({ data: null, message: `Forum posts by category: "${category}" not found`, success: false });
	} else {
		aggregations.unshift({ $match: {} });
		forums = (await forumModel.aggregate(aggregations).exec()) as IForumModel[];
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
					{ $lookup: { from: colUser, localField: "editedBy", foreignField: "_id", as: "editedBy" } },
					{ $unset: unsetAuthorFields("editedBy") },
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
		const forum = (
			await forumModel
				.aggregate([
					{ $match: { _id: Types.ObjectId(_id) } },
					{ $lookup: { from: colForumCategory, localField: "category", foreignField: "_id", as: "category" } },
					{ $lookup: { from: colUser, localField: "author", foreignField: "_id", as: "author" } },
					{ $unset: unsetAuthorFields("author") },
					{ $lookup: { from: colUser, localField: "editedBy", foreignField: "_id", as: "editedBy" } },
					{ $unset: unsetAuthorFields("editedBy") },
					{ $lookup: { from: colComment, localField: "_id", foreignField: "forumId", as: "comments" } },
					{ $unset: ["comments.forumId"] },
				])
				.exec()
		)[0] as IForumModel;

		return res.status(!!forum ? 200 : 422).json({
			data: forum,
			message: !!forum ? `Forum _id: "${_id}" retrieved successfully` : `Forum _id: "${_id}" not found`,
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

export const getForumStats = async (_req: Request, res: Response) => {
	const stats = await forumModel.collection.stats();
	return res.status(200).json({
		data: stats,
		message: "Forum stats retrieved successfully",
		success: true,
	});
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
interface IcategoriesCount {
	_id: string;
	count: number;
}

export const getAllForumCategories = async (req: Request, res: Response) => {
	const count = await forumModel.countDocuments().exec();
	const perPage = parseInt(req.query.perPage as string) || count || 15; // no perPage means get all
	const page = parseInt(req.query.page as string) - 1 || 0;

	const categoriesData = (await forumCategoryModel.aggregate([{ $match: {} }, { $sort: { createdAt: -1 } }, { $skip: perPage * page }, { $limit: perPage }]).exec()) as IForumCategoryModel[];

	// get all categories and sum up the number of forums in each category
	const categoriesCount = (await forumModel.aggregate([{ $match: {} }, { $group: { _id: "$category", count: { $sum: 1 } } }]).exec()) as IcategoriesCount[];

	// combine
	const categories = categoriesData.map((category) => {
		const count = categoriesCount.find((c) => c._id.toString() === category._id.toString())!;
		return { ...category, count: count.count ? count.count : 0 };
	});

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
