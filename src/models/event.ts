import { Schema, model, Document } from "mongoose";
import isURL from "validator/lib/isURL";
import isEmail from "validator/lib/isEmail";
import { DocumentResult, validVisibility, colEvent, colEventRevision, colUser, imageUrlRegex, urlSafeRegex } from "../utils";

interface Ievent {
	author: Schema.Types.ObjectId;
	title: string;
	visibility: string;
	description: string;
	content: string;
	price: number;
	startDate: Date;
	endDate: Date;
	thumbnail?: string;
	tags?: string[];
	location?: string;
	link?: string;
	organizer?: string[];
	email?: string;
	pinned?: boolean;
	showAtHome?: boolean;
	editedBy?: Schema.Types.ObjectId;
}
interface IEventRevision extends Ievent {
	revision: number;
	eventId: Schema.Types.ObjectId;
}
export interface IEventModel extends Ievent, Document, DocumentResult<IEventModel> {}
export interface IEventRevisionModel extends IEventRevision, Document, DocumentResult<IEventRevisionModel> {}

// ---------------------------------------------
const eventSchema = new Schema<IEventModel>(
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
		visibility: {
			type: String,
			required: true,
			enum: validVisibility,
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
			default: [],
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
		editedBy: {
			type: Schema.Types.ObjectId,
			ref: colUser,
			default: undefined,
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

export const eventModel = model<IEventModel>(colEvent, eventSchema);
export const eventRevisionModel = model<IEventRevisionModel>(colEventRevision, eventRevisionSchema);
