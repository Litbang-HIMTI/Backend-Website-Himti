import { Schema, model } from "mongoose";
import { IUser } from "./interfaces/user";

export const userSchema = new Schema<IUser>(
	{
		username: {
			type: String,
			required: true,
			unique: true,
			minlength: 5,
			maxlength: 20,
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
				validator: function (v: string) {
					return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
				},
			},
		},
		password: {
			type: String,
			required: true,
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
		role: {
			type: Array,
			default: ["user"],
		},
	},
	{ collection: "users" }
);

const userModel = model<IUser>("users", userSchema);

export { userModel };
