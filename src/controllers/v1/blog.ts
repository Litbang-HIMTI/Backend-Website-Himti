import { Request, Response } from "express";
import { Types } from "mongoose";
import { blogModel, blogRevisionModel, IBlogRevisionModel } from "../../models/blog";
import { error_400_id, error_500, ___issue___ } from "../../utils";
const id_type_blog = "Blog _id";
const id_type_blogRevision = "Blog Revision _id";
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
		return res.status(!!blog ? 200 : 422).json({
			data: blog,
			message: !!blog ? "Blog retrieved successfully" : `Blog _id: "${_id}" not found`,
			success: !!blog,
		});
	} catch (error) {
		if (error.name === "CastError") {
			return error_400_id(res, _id, id_type_blog);
		} else {
			return error_500(res, error);
		}
	}
};

// POST
export const createBlog = async (req: Request, res: Response) => {
	const blog = await blogModel.create({ ...req.body, author: req.session.userId });
	return res.status(!!blog ? 201 : 500).json({
		data: blog,
		message: !!blog ? "Blog created successfully" : `Unable to create blog post. If you think that this is a bug, please submit an issue at ${___issue___}`,
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
				revisionPost = await blogRevisionModel.create({
					...(blog._doc as IBlogRevisionModel),
					author: Types.ObjectId(req.session.userId!),
					revision: revision[0].revision + 1,
					blogId: Types.ObjectId(_id!),
				});
			} else {
				// create new revision with revision number 1
				revisionPost = await blogRevisionModel.create({ ...(blog._doc as IBlogRevisionModel), author: Types.ObjectId(req.session.userId!), revision: 1, blogId: Types.ObjectId(_id!) });
			}
		}

		return res.status(!!blog ? 200 : 422).json({
			data: blog,
			message: !!blog
				? `Successfully updated Blog${!!revisionPost ? ` and successfully moved old blog post to revision history` : ` fail to move old blog post to revision history`}`
				: `Blog _id: "${_id}" not found`,
			success: !!blog,
		});
	} catch (error) {
		if (error.name === "CastError") {
			return error_400_id(res, _id, id_type_blog);
		} else {
			return error_500(res, error);
		}
	}
};

// DELETE
export const deleteBlog = async (req: Request, res: Response) => {
	const { _id } = req.params;
	try {
		const blog = await blogModel.findByIdAndDelete(_id);
		const { deletedCount, ok } = await blogRevisionModel.deleteMany({ blogId: _id });
		return res.status(!!blog ? 200 : 422).json({
			data: blog,
			message: !!blog
				? `Successfully deleted blog post${ok ? ` and its revision history (Got ${deletedCount} deleted)` : " and fail to delete version history (Operations failed)"}`
				: `Blog _id: "${_id}" not found`,
			success: !!blog,
		});
	} catch (error) {
		if (error.name === "CastError") {
			return error_400_id(res, _id, id_type_blog);
		} else {
			return error_500(res, error);
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
		return res.status(!!blogRevision ? 200 : 422).json({
			data: blogRevision,
			message: !!blogRevision ? "Blog revision retrieved successfully" : `Blog revision _id: "${_id}" not found`,
			success: !!blogRevision,
		});
	} catch (error) {
		if (error.name === "CastError") {
			return error_400_id(res, _id, id_type_blogRevision);
		} else {
			return error_500(res, error);
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
			return error_400_id(res, _id, id_type_blog);
		} else {
			return error_500(res, error);
		}
	}
};

// POST
export const createBlogRevision = async (req: Request, res: Response) => {
	const blogRevision = await blogRevisionModel.create({ ...req.body, author: req.session.userId! });
	return res.status(!!blogRevision ? 201 : 500).json({
		data: blogRevision,
		message: !!blogRevision ? "Blog revision created successfully" : `Unable to create blog revision. If you think that this is a bug, please submit an issue at ${___issue___}`,
		success: !!blogRevision,
	});
};

// PUT
export const updateBlogRevision = async (req: Request, res: Response) => {
	const { _id } = req.params;
	try {
		const blogRevision = await blogRevisionModel.findByIdAndUpdate(_id, { ...req.body, author: req.session.userId! }, { runValidators: true, new: true });
		return res.status(!!blogRevision ? 200 : 422).json({
			data: blogRevision,
			message: !!blogRevision ? "Blog revision updated successfully" : `Fail to update. Blog revision _id: "${_id}" not found`,
			success: !!blogRevision,
		});
	} catch (error) {
		if (error.name === "CastError") {
			return error_400_id(res, _id, id_type_blogRevision);
		} else {
			return error_500(res, error);
		}
	}
};

// DELETE
export const deleteBlogRevision = async (req: Request, res: Response) => {
	const { _id } = req.params;
	try {
		const blogRevision = await blogRevisionModel.findByIdAndDelete(_id);
		return res.status(!!blogRevision ? 200 : 422).json({
			data: blogRevision,
			message: !!blogRevision ? "Blog revision deleted successfully" : `Blog revision _id: "${_id}" not found`,
			success: !!blogRevision,
		});
	} catch (error) {
		if (error.name === "CastError") {
			return error_400_id(res, _id, id_type_blogRevision);
		} else {
			return error_500(res, error);
		}
	}
};
