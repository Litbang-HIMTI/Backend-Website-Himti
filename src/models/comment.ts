import { Schema, model, Document } from "mongoose";
import { colComment, colForum, colUser } from "../utils/constants";

interface IComment {
	author?: Schema.Types.ObjectId;
	content: string;
	forumId: Schema.Types.ObjectId;
}
export interface ICommentModel extends IComment, Document {}

// ---------------------------------------------
const commentSchema = new Schema<ICommentModel>(
	{
		author: {
			type: Schema.Types.ObjectId,
			ref: colUser,
			default: undefined,
		},
		content: {
			type: String,
			required: true,
			maxlength: 10_000, // guest can access so limit it
		},
		forumId: {
			type: Schema.Types.ObjectId,
			ref: colForum,
			required: true,
		},
	},
	{ collection: colComment, timestamps: true }
);

export const commentModel = model<ICommentModel>(colComment, commentSchema);
