import { Request, Response } from "express";
import { forumCategoryModel, IForumCategoryModel } from "../../models/forum_category";
import { forumModel } from "../../models/forum";
import { ___issue___ } from "../../utils";

// --------------------------------------------------------------------------------------------
// FORUM CATEGORY
// GET
interface IcategoriesCount {
	_id: string;
	count: number;
}

export const getAllForumCategories = async (req: Request, res: Response) => {
	const count = await forumCategoryModel.countDocuments().exec();
	const perPage = parseInt(req.query.perPage as string) || count || 15; // no perPage means get all
	const page = parseInt(req.query.page as string) - 1 || 0;

	const categoriesData = (await forumCategoryModel.aggregate([{ $match: {} }, { $sort: { createdAt: -1 } }, { $skip: perPage * page }, { $limit: perPage }]).exec()) as IForumCategoryModel[];

	// get all categories and sum up the number of forums in each category
	const categoriesCount = (await forumModel.aggregate([{ $match: {} }, { $group: { _id: "$category", count: { $sum: 1 } } }]).exec()) as IcategoriesCount[];

	// combine
	const categories = categoriesData.map((category) => {
		const count = categoriesCount.find((c) => c._id.toString() === category._id.toString())!;
		return { ...category, count: count && count.count ? count.count : 0 };
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

export const getOneForumCategory_admin = async (req: Request, res: Response) => {
	const { _id } = req.params;
	const category = await forumCategoryModel.findById({ _id });

	return res.status(!!category ? 200 : 422).json({
		data: category,
		message: !!category ? "Forum category retrieved successfully" : `Forum category name: _id: "${_id}" not found`,
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

	const category = await forumCategoryModel.findByIdAndUpdate(_id, { ...req.body }, { new: true, runValidators: true });
	return res.status(!!category ? 200 : 422).json({
		data: category,
		message: !!category ? "Forum category updated successfully" : `Fail to update. Forum category _id: "${_id}" not found`,
		success: !!category,
	});
};

// DELETE
export const deleteForumCategory = async (req: Request, res: Response) => {
	const { _id } = req.params;
	const category = await forumCategoryModel.findByIdAndRemove(_id);

	return res.status(!!category ? 200 : 422).json({
		data: category,
		message: !!category ? "Forum category deleted successfully" : `Fail to delete. Forum category _id: "${_id}" not found`,
		success: !!category,
	});
};
