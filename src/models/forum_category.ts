import { Schema, model, Document } from "mongoose";
import { colForumCategory, urlSafeRegex } from "../utils";

interface IForumCategory {
	name: string;
	description: string;
}
export interface IForumCategoryModel extends IForumCategory, Document {}

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

export const forumCategoryModel = model<IForumCategoryModel>(colForumCategory, forumCategorySchema);
