import { Schema, model, Document } from "mongoose";
import { colGroup, urlSafeRegex } from "../utils";

interface IGroup {
	name: string;
	description: string;
}
interface IGroupModel extends IGroup, Document {}

// ---------------------------------------------
const groupSchema = new Schema<IGroupModel>(
	{
		name: {
			type: String,
			required: true,
			unique: true,
			validate: {
				validator: (v: string) => urlSafeRegex.test(v),
				message: "Group name must be alphanumeric or these allowed characters: underscore, hyphen, space, ', \", comma, and @",
			},
		},
		description: {
			type: String,
			required: true,
		},
	},
	{ collection: colGroup, timestamps: true }
);

export const GroupModel = model<IGroupModel>(colGroup, groupSchema);
