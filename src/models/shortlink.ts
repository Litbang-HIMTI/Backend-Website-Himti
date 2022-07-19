import { Schema, model, Document } from "mongoose";

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
				validator: (v: string) => /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/.test(v),
				message: "URL must be a valid URL",
			},
		},
		shorten: {
			type: String,
			required: true,
			unique: true,
		},
	},
	{ collection: "shortlinks", timestamps: true }
);

export const shortLinkModel = model<IShortLinkModel>("ShortLink", shortLinkSchema);
