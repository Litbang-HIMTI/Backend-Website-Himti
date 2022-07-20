import { Request, Response } from "express";
import { ___issue___ } from "../utils/constants";
import { blogModel, blogRevisionModel, IBlogRevisionModel } from "../models/blog";

// --------------------------------------------------------------------------------------------
// BLOG
// GET
export const getAllBlogs = async (_req: Request, res: Response) => {
	const blogs = await blogModel.find({});
	return res.status(200).json({
		data: blogs,
		length: blogs.length,
		message: "Blogs retrieved successfully",
		success: true,
	});
};

export const getOneBlog = async (req: Request, res: Response) => {
	const { _id } = req.params;
	try {
		const blog = await blogModel.findById(_id);

		return res.status(200).json({
			data: blog,
			message: !!blog ? "Blog retrieved successfully" : `Blog _id: "${_id}" not found`,
			success: !!blog,
		});
	} catch (error) {
		if (error.name === "CastError") {
			return res.status(400).json({
				data: null,
				message: `Blog _id: "${_id}" is invalid`,
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
export const createBlog = async (req: Request, res: Response) => {
	const blog = await blogModel.create({ ...req.body, author: req.session.userId });
	return res.status(200).json({
		data: blog,
		message: !!blog ? "Blog created successfully" : "Fail to create blog",
		success: !!blog,
	});
};

// PUT
export const updateBlog = async (req: Request, res: Response) => {
	const { _id } = req.params;
	let revisionPost;
	try {
		const blog = await blogModel.findByIdAndUpdate(_id, { ...req.body, author: req.session.userId! }, { runValidators: true, new: true });
		if (blog) {
			const revision = await blogRevisionModel.find({ blogId: _id }).select("-_id -__v -createdAt -updatedAt").sort({ revision: -1 /* desc */ }).limit(1);
			if (revision.length > 0) {
				// update revision by spread and save new revision with incremented revision number
				revisionPost = await blogRevisionModel.create({ ...(blog._doc as IBlogRevisionModel), author: req.session.userId!, revision: revision[0].revision + 1, blogId: _id });
			} else {
				// create new revision with revision number 1
				revisionPost = await blogRevisionModel.create({ ...(blog._doc as IBlogRevisionModel), author: req.session.userId!, revision: 1, blogId: _id });
			}
		}

		return res.status(200).json({
			data: blog,
			message: !!blog
				? `Successfully updated Blog${!!revisionPost ? ` and successfully moved old blog post to revision history` : ` fail to move old blog post to revision history`}`
				: `Blog _id: "${_id}" not found`,
			success: !!blog,
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
export const deleteBlog = async (req: Request, res: Response) => {
	const { _id } = req.params;
	try {
		const blog = await blogModel.findByIdAndDelete(_id);
		const { deletedCount, ok } = await blogRevisionModel.deleteMany({ blogId: _id });
		return res.status(200).json({
			data: blog,
			message: !!blog
				? `Successfully deleted blog post${ok ? ` and its revision history (Got ${deletedCount} deleted)` : " and fail to delete version history (Operations failed)"}`
				: `Blog _id: "${_id}" not found`,
			success: !!blog,
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
// BLOG REVISION
// GET
export const getAllBlogRevisions = async (_req: Request, res: Response) => {
	const blogRevisions = await blogRevisionModel.find({});
	return res.status(200).json({
		data: blogRevisions,
		length: blogRevisions.length,
		message: "Blog revisions retrieved successfully",
		success: true,
	});
};

export const getOneBlogRevision = async (req: Request, res: Response) => {
	const { _id } = req.params;
	try {
		const blogRevision = await blogRevisionModel.findById(_id);

		return res.status(200).json({
			data: blogRevision,
			message: !!blogRevision ? "Blog revision retrieved successfully" : `Blog revision _id: "${_id}" not found`,
			success: !!blogRevision,
		});
	} catch (error) {
		if (error.name === "CastError") {
			return res.status(400).json({
				data: error,
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

export const getBlogRevisionsByBlogId = async (req: Request, res: Response) => {
	const { _id } = req.params;
	try {
		const blogRevisions = await blogRevisionModel.find({ blogId: _id });

		return res.status(200).json({
			data: blogRevisions,
			length: blogRevisions.length,
			message: "Blog post revisions retrieved successfully",
			success: true,
		});
	} catch (error) {
		if (error.name === "CastError") {
			return res.status(400).json({
				data: null,
				length: 0,
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
export const createBlogRevision = async (req: Request, res: Response) => {
	const blogRevision = await blogRevisionModel.create({ ...req.body, author: req.session.userId! });
	return res.status(!!blogRevision ? 201 : 200).json({
		data: blogRevision,
		message: !!blogRevision ? "Blog revision created successfully" : "Fail to create blog revision",
		success: !!blogRevision,
	});
};

// PUT
export const updateBlogRevision = async (req: Request, res: Response) => {
	const { _id } = req.params;
	try {
		const blogRevision = await blogRevisionModel.findByIdAndUpdate(_id, { ...req.body, author: req.session.userId! }, { runValidators: true, new: true });
		return res.status(200).json({
			data: blogRevision,
			message: !!blogRevision ? "Blog revision updated successfully" : `Blog revision _id: "${_id}" not found`,
			success: !!blogRevision,
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
export const deleteBlogRevision = async (req: Request, res: Response) => {
	const { _id } = req.params;
	try {
		const blogRevision = await blogRevisionModel.findByIdAndDelete(_id);
		return res.status(200).json({
			data: blogRevision,
			message: !!blogRevision ? "Blog revision deleted successfully" : `Blog revision _id: "${_id}" not found`,
			success: !!blogRevision,
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
