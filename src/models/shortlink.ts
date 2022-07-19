import { Schema, model, Document } from "mongoose";
import isURL from "validator/lib/isURL";
import { alphaNumericUnderscoreRegex } from "../utils/regex";

interface IShortLink {
	url: string;
	shorten: string;
}
interface IShortLinkModel extends IShortLink, Document {}

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
				validator: (v: string) => alphaNumericUnderscoreRegex.test(v),
				message: "Shorten link must be alphanumeric and cannot contain spaces",
			},
		},
	},
	{ collection: "shortlinks", timestamps: true }
);

export const shortLinkModel = model<IShortLinkModel>("ShortLink", shortLinkSchema);
