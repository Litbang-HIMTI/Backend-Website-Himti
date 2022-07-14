import { Request, Response } from "express";
import { GroupModel } from "../models/group";

// GET
export const getAllGroups = async (_req: Request, res: Response) => {
	const groups = await GroupModel.find({});
	res.status(200).json({
		data: groups,
		length: groups.length,
		message: "Groups retrieved successfully",
		success: true,
	});
};

export const getCertainGroup = async (req: Request, res: Response) => {
	const { groupname } = req.params;
	const group = await GroupModel.findOne({ name: groupname });
	if (!group) {
		res.status(404).json({
			data: null,
			message: "Group not found",
			success: false,
		});
		return;
	}
	res.status(200).json({
		data: group,
		message: `Group ${groupname} retrieved successfully`,
		success: true,
	});
};

// POST
export const createGroup = async (req: Request, res: Response) => {
	const group = new GroupModel(req.body);
	const data = await group.save();
	res.status(201).json({
		data: group,
		created: !!data,
		message: !!data ? "Group created successfully" : "Fail to create group",
		success: true,
	});
};

// PUT
export const updateGroup = async (req: Request, res: Response) => {
	const { groupname } = req.params;

	// find and update while it's validated using mongoose
	const group = await GroupModel.findOneAndUpdate({ name: groupname }, req.body, { runValidators: true, new: true });
	res.status(200).json({
		data: group ? group : `Group ${groupname} not found`,
		updated: !!group,
		message: !!group ? "Group updated successfully" : "Fail to update group",
		success: true,
	});
};

// DELETE
export const deleteGroup = async (req: Request, res: Response) => {
	const { groupname } = req.params;
	const group = await GroupModel.findOneAndDelete({ name: groupname });
	res.status(200).json({
		data: group ? group : `Group ${groupname} not found`,
		deleted: !!group,
		message: !!group ? "Group deleted successfully" : "Fail to delete group",
		success: true,
	});
};
