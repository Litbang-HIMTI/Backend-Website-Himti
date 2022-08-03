import { Schema, model, Document } from "mongoose";
import { colNote, urlSafeRegex } from "../utils";

interface INote {
	author: Schema.Types.ObjectId;
	title: string;
	content: string;
	color_text?: string;
	color_bg?: string;
	edited_by?: Schema.Types.ObjectId;
}
export interface INoteModel extends INote, Document {}

// ---------------------------------------------
const noteSchema = new Schema<INoteModel>(
	{
		author: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		title: {
			type: String,
			required: true,
			validate: {
				validator: (v: string) => urlSafeRegex.test(v),
				message: "Title name must be alphanumeric or these allowed characters: underscore, hyphen, space, ', \", comma, and @",
			},
		},
		content: {
			type: String,
			required: true,
		},
		color_text: {
			type: String,
			default: "#000000",
		},
		color_bg: {
			type: String,
			default: "#ffffff",
		},
		edited_by: {
			type: Schema.Types.ObjectId,
			ref: "User",
			default: undefined,
		},
	},
	{ collection: colNote, timestamps: true }
);

export const noteModel = model<INoteModel>(colNote, noteSchema);
