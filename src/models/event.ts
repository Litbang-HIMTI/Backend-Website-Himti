import { Schema, model, Document } from "mongoose";
import isURL from "validator/lib/isURL";
import isEmail from "validator/lib/isEmail";
import { imageUrlRegex } from "../utils/regex";

interface Ievent {
	name: string;
	thumbnail?: string;
	tags?: string[];
	description: string;
	content: string;
	price: number;
	startDate: Date;
	endDate: Date;
	location?: string;
	link?: string;
	organizer?: string;
	email?: string;
}
interface IeventModel extends Ievent, Document {}

const eventSchema = new Schema<IeventModel>({
	name: {
		type: String,
		required: true,
	},
	thumbnail: {
		type: String,
		validate: {
			validator: (v: string) => isURL(v) && imageUrlRegex.test(v),
			message: "Thumbnail must be a valid image url",
		},
		default: "",
	},
	tags: {
		type: Array,
		default: [],
	},
	description: {
		type: String,
		required: true,
	},
	content: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	startDate: {
		type: Date,
		required: true,
	},
	endDate: {
		type: Date,
		required: true,
	},
	location: {
		type: String,
		default: "",
	},
	link: {
		type: String,
		default: "",
		validate: {
			validator: (v: string) => isURL(v),
			message: "Link must be a valid url",
		},
	},
	organizer: {
		type: String,
		default: "",
	},
	email: {
		type: String,
		default: "",
		validate: {
			validator: (v: string) => isEmail(v),
			message: "Email must be a valid email",
		},
	},
});

export const eventModel = model<IeventModel>("event", eventSchema);
