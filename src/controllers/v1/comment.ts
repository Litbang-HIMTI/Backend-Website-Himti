import { Request, Response } from "express";
import { Types } from "mongoose";
import { blogModel } from "src/models/blog";
import { eventModel } from "src/models/event";
import { commentModel, ICommentModel } from "../../models/comment";
import { forumModel } from "../../models/forum";
import { ___issue___, colUser, unsetAuthorFields, colForum } from "../../utils";

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

export const getCommentByForumId = async (req: Request, res: Response) => {
	const { forumId } = req.params;
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
};

export const getCommentByPostId = async (req: Request, res: Response) => {
	const { postId } = req.params;
	const count = await commentModel.countDocuments({ postId: Types.ObjectId(postId) }).exec();
	const perPage = parseInt(req.query.perPage as string) || count || 15; // no perPage means get all
	const page = parseInt(req.query.page as string) - 1 || 0;
	const content = req.query.content === "1";

	const aggregations = [
		{ $match: { postId: Types.ObjectId(postId) } },
		{ $sort: { createdAt: -1 } },
		{ $skip: perPage * page },
		{ $limit: perPage },
		{ $lookup: { from: colUser, localField: "author", foreignField: "_id", as: "author" } },
		{ $unset: unsetAuthorFields("author") },
		{ $lookup: { from: colForum, localField: "postId", foreignField: "_id", as: "postId" } },
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

export const getCommentByEventId = async (req: Request, res: Response) => {
	const { eventId } = req.params;
	const count = await commentModel.countDocuments({ eventId: Types.ObjectId(eventId) }).exec();
	const perPage = parseInt(req.query.perPage as string) || count || 15; // no perPage means get all
	const page = parseInt(req.query.page as string) - 1 || 0;
	const content = req.query.content === "1";

	const aggregations = [
		{ $match: { eventId: Types.ObjectId(eventId) } },
		{ $sort: { createdAt: -1 } },
		{ $skip: perPage * page },
		{ $limit: perPage },
		{ $lookup: { from: colUser, localField: "author", foreignField: "_id", as: "author" } },
		{ $unset: unsetAuthorFields("author") },
		{ $lookup: { from: colForum, localField: "eventId", foreignField: "_id", as: "eventId" } },
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
	const { forumId, postId, eventId, content } = req.body;

	if (forumId) {
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

		const comment = await commentModel.create({ author: req.session.userId ? req.session.userId : undefined, forumId: Types.ObjectId(forumId), content });
		return res.status(!!comment ? 201 : 500).json({
			data: comment,
			message: !!comment ? "Comment created successfully" : `Unable to create comment. If you think that this is a bug, please submit an issue at ${___issue___}`,
			success: !!comment,
		});
	} else if (postId) {
		const post = await blogModel.findById(postId);
		if (!post)
			return res.status(422).json({
				data: null,
				message: `Post _id: "${postId}" not found`,
				success: false,
			});

		const comment = await commentModel.create({ author: req.session.userId ? req.session.userId : undefined, blogId: Types.ObjectId(postId), content });
		return res.status(!!comment ? 201 : 500).json({
			data: comment,
			message: !!comment ? "Comment created successfully" : `Unable to create comment. If you think that this is a bug, please submit an issue at ${___issue___}`,
			success: !!comment,
		});
	} else if (eventId) {
		const event = await eventModel.findById(eventId);
		if (!event)
			return res.status(422).json({
				data: null,
				message: `Event _id: "${eventId}" not found`,
				success: false,
			});

		const comment = await commentModel.create({ author: req.session.userId ? req.session.userId : undefined, eventId: Types.ObjectId(eventId), content });
		return res.status(!!comment ? 201 : 500).json({
			data: comment,
			message: !!comment ? "Comment created successfully" : `Unable to create comment. If you think that this is a bug, please submit an issue at ${___issue___}`,
			success: !!comment,
		});
	} else {
		return res.status(400).json({
			data: null,
			message: "Fail to create. Missing one of these ids (forumId, postId, or eventId)",
			success: false,
		});
	}
};

// PUT
export const updateComment = async (req: Request, res: Response) => {
	const { _id } = req.params;
	const { content } = req.body;
	const comment = await commentModel.findByIdAndUpdate(_id, { content }, { runValidators: true, new: true });
	return res.status(!!comment ? 200 : 422).json({
		data: comment,
		message: !!comment ? "Comment updated successfully" : `Fail to update. Comment _id: "${_id}" not found`,
		success: !!comment,
	});
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
