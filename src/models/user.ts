import { Schema, model, Document } from "mongoose";
import crypto from "crypto";
import isEmail from "validator/lib/isEmail";
import { DocumentResult, colGroup, colUser, urlSaferRegex } from "../utils";

// ---------------------------------------------
/**
 * Roles interface
 * @admin = "Do everything can access dashboard"
 * @editor = "Content editor. Limited access to dashboard that includes blog & events"
 * @forum_moderator = "Forum moderator. Limited access to dashboard that includes forum"
 * @shortlink_moderator = "Shortlink moderator. Limited access to dashboard that includes shortlink"
 * @user = "Site user. Not implemented."
 */
export type TRoles = "admin" | "editor" | "forum_moderator" | "shortlink_moderator" | "user";
const validRoles: TRoles[] = ["admin", "editor", "forum_moderator", "shortlink_moderator", "user"];
interface IUser {
	username: string;
	first_name: string;
	last_name: string;
	email: string;
	group?: Schema.Types.ObjectId[];
	role: TRoles[];
	salt: string;
	hash: string;
	setPassword: (password: string) => void;
	validatePassword: (password: string) => boolean;
}
export interface IUserModel extends IUser, Document, DocumentResult<IUserModel> {}

// ---------------------------------------------
const userSchema = new Schema<IUserModel>(
	{
		username: {
			type: String,
			required: true,
			unique: true,
			minlength: 5,
			maxlength: 40,
			validate: {
				validator: (v: string) => urlSaferRegex.test(v),
				message: "Username must be alphanumeric and cannot contain spaces. Allowed characters: a-z, A-Z, 0-9, _, -",
			},
		},
		first_name: {
			type: String,
			required: true,
		},
		last_name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			minlength: 3,
			validate: {
				validator: (v: string) => isEmail(v),
				message: "Invalid email address provided",
			},
		},
		// ! need @ts-ignore on latest mongoose
		role: {
			type: Array,
			required: true,
			validate: {
				validator: (v: TRoles[]) => v.every((role) => validRoles.includes(role)),
				message: "Invalid role provided",
			},
		},
		group: {
			type: [Schema.Types.ObjectId],
			ref: colGroup,
			default: [],
		},
		hash: String,
		salt: String,
	},
	{ collection: colUser, timestamps: true } // timestamps add createdAt and updatedAt fields automatically
);

userSchema.methods.setPassword = function (password) {
	this.salt = crypto.randomBytes(16).toString("hex");
	// eslint-disable-next-line
	this.hash = crypto.pbkdf2Sync(password, this.salt, parseInt(process.env.P_ITERATION!), parseInt(process.env.P_LENGTH!), process.env.P_HASH!).toString("hex");
};

userSchema.methods.validatePassword = function (password) {
	// eslint-disable-next-line
	const hash = crypto.pbkdf2Sync(password, this.salt, parseInt(process.env.P_ITERATION!), parseInt(process.env.P_LENGTH!), process.env.P_HASH!).toString("hex");
	return this.hash === hash;
};

export const userModel = model<IUserModel>(colUser, userSchema);
