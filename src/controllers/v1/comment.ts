import { Request, Response } from "express";
import { Types } from "mongoose";
import { commentModel } from "../../models/comment";
import { ___issue___ } from "../../utils/constants";

// GET
export const getAllComments = async (_req: Request, res: Response) => {
	const comments = await commentModel.find({});
	return res.status(200).json({
		data: comments,
		length: comments.length,
		message: "Comments retrieved successfully",
		success: true,
	});
};

export const getCommentByAuthor = async (req: Request, res: Response) => {
	const { authorId } = req.params;
	try {
		const comments = await commentModel.find({ author: Types.ObjectId(authorId) });
		return res.status(200).json({
			data: comments,
			length: comments.length,
			message: "Comments retrieved successfully",
			success: true,
		});
	} catch (error) {
		if (error.name === "CastError") {
			return res.status(400).json({
				data: null,
				message: `authorId: "${authorId}" is invalid`,
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

export const getCommentByForumId = async (req: Request, res: Response) => {
	const { _id } = req.params;
	try {
		const comments = await commentModel.find({ forumId: Types.ObjectId(_id) });
		return res.status(200).json({
			data: comments,
			length: comments.length,
			message: "Comments retrieved successfully",
			success: true,
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

// POST
export const createComment = async (req: Request, res: Response) => {
	const { forumId, content } = req.body;
	try {
		const comment = await commentModel.create({ author: req.session.userId ? Types.ObjectId(req.session.userId) : undefined, forumId: Types.ObjectId(forumId), content });
		return res.status(200).json({
			data: comment,
			message: "Comment created successfully",
			success: true,
		});
	} catch (error) {
		if (error.name === "CastError") {
			return res.status(400).json({
				data: null,
				message: `forumId: "${forumId}" is invalid`,
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

// PUT
export const updateComment = async (req: Request, res: Response) => {
	const { _id } = req.params;
	const { content } = req.body;
	try {
		const comment = await commentModel.findByIdAndUpdate(_id, { content }, { runValidators: true, new: true });
		return res.status(200).json({
			data: comment,
			message: "Comment updated successfully",
			success: true,
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
export const deleteComment = async (req: Request, res: Response) => {
	const { _id } = req.params;
	const comment = await commentModel.findByIdAndDelete(_id);
	return res.status(200).json({
		data: comment,
		message: "Comment deleted successfully",
		success: true,
	});
};
