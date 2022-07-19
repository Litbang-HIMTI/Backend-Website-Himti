import { Schema, model, Document } from "mongoose";
import { urlSaferRegex } from "../utils/regex";

interface IGroup {
	name: string;
	description: string;
}

interface IGroupModel extends IGroup, Document {}

const groupSchema = new Schema<IGroupModel>(
	{
		name: {
			type: String,
			required: true,
			unique: true,
			validate: {
				validator: (v: string) => urlSaferRegex.test(v),
				message: "Group name must be alphanumeric and cannot contain spaces. Allowed characters: a-z, A-Z, 0-9, _, -",
			},
		},
		description: {
			type: String,
			required: true,
		},
	},
	{ collection: "groups", timestamps: true }
);

export const GroupModel = model<IGroupModel>("groups", groupSchema);
