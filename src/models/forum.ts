import { Schema, model, Document } from "mongoose";
import { urlSafeRegex } from "../utils/regex";
import { colForum, colForumCategory, colUser } from "../utils/constants";

interface IForum {
	author: Schema.Types.ObjectId;
	title: string;
	content: string;
	category: Schema.Types.ObjectId;
	editedBy?: Schema.Types.ObjectId;
	locked?: boolean;
	pinned?: boolean;
	showAtHome?: boolean;
}
interface IForumCategory {
	name: string;
	description: string;
}
interface IForumModel extends IForum, Document {}
interface IForumCategoryModel extends IForumCategory, Document {}

const forumSchema = new Schema<IForumModel>(
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
				message: "Forum title must be alphanumeric or these allowed characters: underscore, hyphen, space, ', \", comma, and @",
			},
		},
		content: {
			type: String,
			required: true,
		},
		category: {
			type: Schema.Types.ObjectId,
			ref: colForumCategory,
			required: true,
		},
		editedBy: {
			type: Schema.Types.ObjectId,
			ref: colUser,
			default: undefined,
		},
		locked: {
			type: Boolean,
			default: false,
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
	{ collection: colForum, timestamps: true }
);

const forumCategorySchema = new Schema<IForumCategoryModel>(
	{
		name: {
			type: String,
			required: true,
			unique: true,
			validate: {
				validator: (v: string) => urlSafeRegex.test(v),
				message: "Forum category name must be alphanumeric or these allowed characters: underscore, hyphen, space, ', \", comma, and @",
			},
		},
		description: {
			type: String,
			required: true,
		},
	},
	{ collection: colForumCategory, timestamps: true }
);

export const forumModel = model<IForumModel>(colForum, forumSchema);
export const forumCategoryModel = model<IForumCategoryModel>(colForumCategory, forumCategorySchema);
