import { Schema, model, Document } from "mongoose";
import isURL from "validator/lib/isURL";
import { colShortLink, urlSaferRegex } from "../utils";

interface IShortLink {
	url: string;
	shorten: string;
	clickCount?: number;
}
interface IShortLinkModel extends IShortLink, Document {}

// ---------------------------------------------
const shortLinkSchema = new Schema<IShortLinkModel>(
	{
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
	},
	{ collection: colShortLink, timestamps: true }
);

export const shortLinkModel = model<IShortLinkModel>(colShortLink, shortLinkSchema);
