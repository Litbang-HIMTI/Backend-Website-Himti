import { Schema, model, Document } from "mongoose";
import { alphaNumericUnderscoreRegex } from "../utils/regex";

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
				validator: (v: string) => alphaNumericUnderscoreRegex.test(v),
				message: "Group name must be alphanumeric and cannot contain spaces",
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
