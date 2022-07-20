import { Schema, model, Document } from "mongoose";
import isURL from "validator/lib/isURL";
import { urlSaferRegex } from "../utils/regex";
import { cShortLink } from "../utils/constants";

interface IShortLink {
	url: string;
	shorten: string;
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
	},
	{ collection: cShortLink, timestamps: true }
);

export const shortLinkModel = model<IShortLinkModel>(cShortLink, shortLinkSchema);
