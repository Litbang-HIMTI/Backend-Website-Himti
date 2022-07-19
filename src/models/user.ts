import { Schema, model, Document } from "mongoose";
import crypto from "crypto";
import isEmail from "validator/lib/isEmail";
import { urlSaferRegex } from "../utils/regex";

// ---------------------------------------------
/**
 * Roles interface
 * @user = "Site user. Can login, edit profile, view other users, and create/edit/delete their post and comment. Guest user can view profile, post comment but cannot their own forum post."
 * @admin = "Do everything can access dashboard"
 * @editor = "Content editor. Limited access to dashboard that includes blog & events"
 * @forum_moderator = "Forum moderator. Limited access to dashboard that includes forum"
 */
type TRoles = "user" | "admin" | "editor" | "forum_moderator";
const validRoles: TRoles[] = ["user", "admin", "editor", "forum_moderator"];
interface IUser {
	username: string;
	first_name: string;
	last_name: string;
	email: string;
	group: string[];
	role: TRoles[];
	salt: string;
	hash: string;
	setPassword: (password: string) => void;
	validatePassword: (password: string) => boolean;
}
interface IUserModel extends IUser, Document {}

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
			type: Array,
			default: [],
		},
		hash: String,
		salt: String,
	},
	{ collection: "users", timestamps: true } // timestamps add createdAt and updatedAt fields automatically
);

userSchema.methods.setPassword = function (password) {
	this.salt = crypto.randomBytes(16).toString("hex");
	this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, "sha512").toString("hex");
};

userSchema.methods.validatePassword = function (password) {
	const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, "sha512").toString("hex");
	return this.hash === hash;
};

export const userModel = model<IUserModel>("users", userSchema);

export const validateQuery = (data: IUser) => {
	const valid = data.username && data.first_name && data.last_name && data.email && data.role && data.role.length > 0;
	const queryData = (({ username, first_name, last_name, email, role }: IUser) => ({ username, first_name, last_name, email, role }))(data);

	return { valid, queryData };
};
