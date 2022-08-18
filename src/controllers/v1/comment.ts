import { Request, Response } from "express";
import { Types } from "mongoose";
import { commentModel, ICommentModel } from "../../models/comment";
import { forumModel } from "../../models/forum";
import { error_400_id, error_500, ___issue___, colUser, unsetAuthorFields, colForum } from "../../utils";

// GET
export const getAllComments = async (req: Request, res: Response) => {
	const count = await commentModel.countDocuments().exec();
	const perPage = parseInt(req.query.perPage as string) || count || 15; // no perPage means get all
	const page = parseInt(req.query.page as string) - 1 || 0;
	const content = req.query.content === "1";

	const aggregations = [
		{ $match: {} },
		{ $sort: { createdAt: -1 } },
		{ $skip: perPage * page },
		{ $limit: perPage },
		{ $lookup: { from: colUser, localField: "author", foreignField: "_id", as: "author" } },
		{ $unset: unsetAuthorFields("author") },
		{ $lookup: { from: colForum, localField: "forumId", foreignField: "_id", as: "forumId" } },
		{ $unset: ["content"] },
	];
	if (content) aggregations.pop(); // remove unset content so we can get the content

	const comments = (await commentModel.aggregate(aggregations).exec()) as ICommentModel[];

	return res.status(200).json({
		data: comments,
		page: page + 1,
		pages: Math.ceil(count / perPage),
		message: "Comments retrieved successfully",
		success: true,
	});
};

export const getCommentByAuthor = async (req: Request, res: Response) => {
	const { authorId } = req.params;
	try {
		const count = await commentModel.countDocuments({ author: Types.ObjectId(authorId) }).exec();
		const perPage = parseInt(req.query.perPage as string) || count || 15; // no perPage means get all
		const page = parseInt(req.query.page as string) - 1 || 0;
		const content = req.query.content === "1";

		const aggregations = [
			{ $match: { author: Types.ObjectId(authorId) } },
			{ $sort: { createdAt: -1 } },
			{ $skip: perPage * page },
			{ $limit: perPage },
			{ $lookup: { from: colUser, localField: "author", foreignField: "_id", as: "author" } },
			{ $unset: unsetAuthorFields("author") },
			{ $lookup: { from: colForum, localField: "forumId", foreignField: "_id", as: "forumId" } },
			{ $unset: ["content"] },
		];
		if (content) aggregations.pop(); // remove unset content so we can get the content

		const comments = (await commentModel.aggregate(aggregations).exec()) as ICommentModel[];

		return res.status(200).json({
			data: comments,
			page: page + 1,
			pages: Math.ceil(count / perPage),
			message: "Comments retrieved successfully",
			success: true,
		});
	} catch (error) {
		if (error.name === "CastError") {
			return error_400_id(res, authorId, "authorId");
		} else {
			return error_500(res, error);
		}
	}
};

export const getCommentByForumId = async (req: Request, res: Response) => {
	const { forumId } = req.params;
	try {
		const count = await commentModel.countDocuments({ forumId: Types.ObjectId(forumId) }).exec();
		const perPage = parseInt(req.query.perPage as string) || count || 15; // no perPage means get all
		const page = parseInt(req.query.page as string) - 1 || 0;
		const content = req.query.content === "1";

		const aggregations = [
			{ $match: { forumId: Types.ObjectId(forumId) } },
			{ $sort: { createdAt: -1 } },
			{ $skip: perPage * page },
			{ $limit: perPage },
			{ $lookup: { from: colUser, localField: "author", foreignField: "_id", as: "author" } },
			{ $unset: unsetAuthorFields("author") },
			{ $lookup: { from: colForum, localField: "forumId", foreignField: "_id", as: "forumId" } },
			{ $unset: ["content"] },
		];
		if (content) aggregations.pop(); // remove unset content so we can get the content

		const comments = (await commentModel.aggregate(aggregations).exec()) as ICommentModel[];

		return res.status(200).json({
			data: comments,
			page: page + 1,
			pages: Math.ceil(count / perPage),
			message: "Comments retrieved successfully",
			success: true,
		});
	} catch (error) {
		if (error.name === "CastError") {
			return error_400_id(res, forumId, "forumId");
		} else {
			return error_500(res, error);
		}
	}
};

export const getCommentStats = async (_req: Request, res: Response) => {
	const stats = await commentModel.collection.stats();
	return res.status(200).json({
		data: stats,
		message: "Comment stats retrieved successfully",
		success: true,
	});
};

// POST
export const createComment = async (req: Request, res: Response) => {
	const { forumId, content } = req.body;
	try {
		// first get forum from forumId
		const forum = await forumModel.findById(forumId);
		if (!forum)
			return res.status(422).json({
				data: null,
				message: `Forum _id: "${forumId}" not found`,
				success: false,
			});

		if (forum.locked) {
			// check if logged in or not
			if (!req.session) return res.status(403).json({ data: null, message: "Forum is locked", success: false });
			// * if logged in check if user is moderator or not
			else if (!req.session.role?.includes("forum_moderator") && !req.session.role?.includes("admin"))
				return res.status(403).json({ data: null, message: "Forum is locked", success: false });
		}

		const comment = await commentModel.create({ author: req.session.userId ? Types.ObjectId(req.session.userId) : undefined, forumId: Types.ObjectId(forumId), content });
		return res.status(!!comment ? 201 : 500).json({
			data: comment,
			message: !!comment ? "Comment created successfully" : `Unable to create comment. If you think that this is a bug, please submit an issue at ${___issue___}`,
			success: !!comment,
		});
	} catch (error) {
		if (error.name === "CastError") {
			return error_400_id(res, forumId, "forumId");
		} else {
			return error_500(res, error);
		}
	}
};

// PUT
export const updateComment = async (req: Request, res: Response) => {
	const { _id } = req.params;
	const { content } = req.body;
	try {
		const comment = await commentModel.findByIdAndUpdate(_id, { content }, { runValidators: true, new: true });
		return res.status(!!comment ? 200 : 422).json({
			data: comment,
			message: !!comment ? "Comment updated successfully" : `Fail to update. Comment _id: "${_id}" not found`,
			success: !!comment,
		});
	} catch (error) {
		if (error.name === "CastError") {
			return error_400_id(res, _id, "comment _id");
		} else {
			return error_500(res, error);
		}
	}
};

// DELETE
export const deleteComment = async (req: Request, res: Response) => {
	const { _id } = req.params;
	const comment = await commentModel.findByIdAndDelete(_id);
	return res.status(!!comment ? 200 : 422).json({
		data: comment,
		message: !!comment ? "Comment deleted successfully" : `Comment _id: "${_id}" not found`,
		success: !!comment,
	});
};
