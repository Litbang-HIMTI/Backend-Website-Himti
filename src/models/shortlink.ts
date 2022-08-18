import { Schema, model, Document } from "mongoose";
import isURL from "validator/lib/isURL";
import { colShortLink, colUser, urlSaferRegex } from "../utils";

interface IShortLink {
	author: Schema.Types.ObjectId;
	url: string;
	shorten: string;
	clickCount?: number;
	editedBy?: Schema.Types.ObjectId;
}
export interface IShortLinkModel extends IShortLink, Document {}

// ---------------------------------------------
const shortLinkSchema = new Schema<IShortLinkModel>(
	{
		author: {
			type: Schema.Types.ObjectId,
			ref: colUser,
			required: true,
		},
		url: {
			type: String,
			required: true,
			unique: true,
			validate: {
				validator: (v: string) => isURL(v),
				message: "URL must be a valid URL",
			},
		},
		shorten: {
			type: String,
			required: true,
			unique: true,
			validate: {
				validator: (v: string) => urlSaferRegex.test(v),
				message: "Shorten link must be alphanumeric and cannot contain spaces. Allowed characters: a-z, A-Z, 0-9, _, -",
			},
		},
		clickCount: {
			type: Number,
			default: 0,
		},
		editedBy: {
			type: Schema.Types.ObjectId,
			ref: colUser,
		},
	},
	{ collection: colShortLink, timestamps: true }
);

export const shortLinkModel = model<IShortLinkModel>(colShortLink, shortLinkSchema);
