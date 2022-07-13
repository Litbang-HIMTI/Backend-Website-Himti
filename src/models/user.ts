import { Schema, model, Document } from "mongoose";

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
	password: string;
	createdAt: Date;
	role: TRoles[];
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
			maxlength: 30,
			validate: {
				validator: (v: string) => /^[a-zA-Z0-9_]+$/.test(v),
				message: "Username must be alphanumeric and cannot contain spaces",
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
				validator: (v: string) => {
					return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
				},
				message: "Invalid email address provided",
			},
		},
		password: {
			type: String,
			required: true,
			minlength: 8,
			maxlength: 100,
			validate: {
				validator: (v: string) => {
					// atleast 1 lowercase, 1 uppercase, 1 number, 1 special character, minimal length of 8
					return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._-])[A-Za-z\d@$!%*?&._-]{8,}$/.test(v);
				},
				message: "Password must be at least 8 characters long and contain at least one lowercase, one uppercase, one number and one special character",
			},
		},
		// ! need @ts-ignore on latest mongoose
		role: {
			type: Array,
			required: true,
			validate: {
				validator: (v: TRoles[]) => {
					return v.every((role) => validRoles.includes(role));
				},
				message: "Invalid role provided",
			},
		},
		createdAt: {
			type: Date,
			default: Date.now,
			immutable: true, // disable editing
		},
	},
	{ collection: "users" }
);

export const userModel = model<IUserModel>("users", userSchema);

export const validateQuery = (data: IUser) => {
	const valid = data.username && data.first_name && data.last_name && data.email && data.password && data.role && data.role.length > 0;
	const queryData = (({ username, first_name, last_name, email, password, role }: IUser) => ({ username, first_name, last_name, email, password, role }))(data);

	return { valid, queryData };
};
