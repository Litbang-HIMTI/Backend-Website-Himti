import { Schema, model, Document } from "mongoose";
import isURL from "validator/lib/isURL";
import { imageUrlRegex, urlSafeRegex } from "../utils/regex";
import { colBlog, colBlogRevision, colUser } from "../utils/constants";
import { DocumentResult } from "../utils/generic";

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
export interface IBlogModel extends IBlog, Document, DocumentResult<IBlogModel> {}
export interface IBlogRevisionModel extends IBlogRevision, Document, DocumentResult<IBlogRevisionModel> {}

// ---------------------------------------------
const blogSchema = new Schema<IBlogModel>(
	{
		author: {
			type: Schema.Types.ObjectId,
			ref: colUser,
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
			default: [],
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
	{ collection: colBlog, timestamps: true }
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
			ref: colBlog,
			required: true,
		},
	},
	{ collection: colBlogRevision, timestamps: true }
);

export const blogModel = model<IBlogModel>(colBlog, blogSchema);
export const blogRevisionModel = model<IBlogRevisionModel>(colBlogRevision, blogRevisionSchema);
