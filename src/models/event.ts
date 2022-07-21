import { Schema, model, Document } from "mongoose";
import isURL from "validator/lib/isURL";
import isEmail from "validator/lib/isEmail";
import { imageUrlRegex, urlSafeRegex } from "../utils/regex";
import { colEvent, colEventRevision, colUser } from "../utils/constants";
import { DocumentResult } from "../utils/types";

interface Ievent {
	author: Schema.Types.ObjectId;
	title: string;
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
interface IEventRevision extends Ievent {
	revision: number;
	eventId: Schema.Types.ObjectId;
}
export interface IeventModel extends Ievent, Document, DocumentResult<IeventModel> {}
export interface IEventRevisionModel extends IEventRevision, Document, DocumentResult<IEventRevisionModel> {}

// ---------------------------------------------
const eventSchema = new Schema<IeventModel>(
	{
		author: { type: Schema.Types.ObjectId, ref: colUser, required: true },
		title: {
			type: String,
			required: true,
			validate: {
				validator: (v: string) => urlSafeRegex.test(v),
				message: "Event title must be alphanumeric or these allowed characters: underscore, hyphen, space, ', \", comma, and @",
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
	{ collection: colEvent, timestamps: true }
);

const eventRevisionSchema = new Schema<IEventRevisionModel>(
	{
		...eventSchema.obj,
		revision: {
			type: Number,
			required: true,
		},
		eventId: {
			type: Schema.Types.ObjectId,
			ref: colEvent,
			required: true,
		},
	},
	{ collection: colEventRevision, timestamps: true }
);

export const eventModel = model<IeventModel>(colEvent, eventSchema);
export const eventRevisionModel = model<IEventRevisionModel>(colEventRevision, eventRevisionSchema);
