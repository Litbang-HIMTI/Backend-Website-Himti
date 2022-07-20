import { Schema, model, Document } from "mongoose";
import isURL from "validator/lib/isURL";
import { imageUrlRegex, urlSafeRegex } from "../utils/regex";
import { cBlog, cBlogRevision, cUser } from "../utils/constants";

type TVisibility = "public" | "draft" | "private";
const validVisibility: TVisibility[] = ["public", "draft", "private"];
interface IBlog {
	author: string;
	title: string;
	visibility: string;
	description: string;
	content: string;
	thumbnail?: string;
	tags?: string[];
	pinned?: boolean;
	showAtHome?: boolean;
}

interface IBlogRevision extends IBlog {
	revision: number;
	blogId: string;
}

interface IBlogModel extends IBlog, Document {}
interface IBlogRevisionModel extends IBlogRevision, Document {}

// ---------------------------------------------
const blogSchema = new Schema<IBlogModel>(
	{
		author: {
			type: Schema.Types.ObjectId,
			ref: cUser,
			required: true,
		},
		title: {
			type: String,
			required: true,
			validate: {
				validator: (v: string) => urlSafeRegex.test(v),
				message: "Blog title must be alphanumeric or these allowed characters: underscore, hyphen, space, ', \", comma, and @",
			},
		},
		visibility: {
			type: String,
			required: true,
			enum: validVisibility,
		},
		description: {
			type: String,
			required: true,
		},
		content: {
			type: String,
			required: true,
		},
		thumbnail: {
			type: String,
			validate: {
				validator: (v: string) => isURL(v) && imageUrlRegex.test(v),
				message: "Thumbnail must be a valid image url",
			},
			default: undefined,
		},
		tags: {
			type: [String],
			validate: {
				validator: (v: string[]) => v.every((tag) => urlSafeRegex.test(tag)),
				message: "Tags must be alphanumeric or these allowed characters: underscore, hyphen, space, ', \", comma, and @",
			},
			default: undefined,
		},
		pinned: {
			type: Boolean,
			default: false,
		},
		showAtHome: {
			type: Boolean,
			default: false,
		},
	},
	{ collection: cBlog, timestamps: true }
);

const blogRevisionSchema = new Schema<IBlogRevisionModel>(
	{
		...blogSchema.obj,
		revision: {
			type: Number,
			required: true,
		},
		blogId: {
			type: Schema.Types.ObjectId,
			ref: cBlog,
			required: true,
		},
	},
	{ collection: cBlogRevision, timestamps: true }
);

export const blogModel = model<IBlogModel>(cBlog, blogSchema);
export const blogRevisionModel = model<IBlogRevisionModel>(cBlogRevision, blogRevisionSchema);
