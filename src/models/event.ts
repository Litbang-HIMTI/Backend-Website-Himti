import { Schema, model, Document } from "mongoose";
import isURL from "validator/lib/isURL";
import isEmail from "validator/lib/isEmail";
import { imageUrlRegex, urlSafeRegex } from "../utils/regex";
import { cEvent } from "../utils/constants";

interface Ievent {
	name: string;
	description: string;
	content: string;
	price: number;
	startDate: Date;
	endDate: Date;
	thumbnail?: string;
	tags?: string[];
	location?: string;
	link?: string;
	organizer?: string;
	email?: string;
	pinned?: boolean;
	showAtHome?: boolean;
}
interface IeventModel extends Ievent, Document {}

// ---------------------------------------------
const eventSchema = new Schema<IeventModel>(
	{
		name: {
			type: String,
			required: true,
			validate: {
				validator: (v: string) => urlSafeRegex.test(v),
				message: "Event name must be alphanumeric or these allowed characters: underscore, hyphen, space, ', \", comma, and @",
			},
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
		thumbnail: {
			type: String,
			validate: {
				validator: (v: string) => isURL(v) && imageUrlRegex.test(v),
				message: "Thumbnail must be a valid image url",
			},
			default: undefined,
		},
		tags: {
			type: Array,
			default: [],
		},
		location: {
			type: String,
			default: undefined,
		},
		link: {
			type: String,
			default: undefined,
			validate: {
				validator: (v: string) => isURL(v),
				message: "Link must be a valid url",
			},
		},
		organizer: {
			type: String,
			default: undefined,
		},
		email: {
			type: String,
			default: undefined,
			validate: {
				validator: (v: string) => isEmail(v),
				message: "Email must be a valid email",
			},
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
	{ collection: cEvent, timestamps: true }
);

export const eventModel = model<IeventModel>(cEvent, eventSchema);
