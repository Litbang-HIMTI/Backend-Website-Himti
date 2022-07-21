import { Request, Response } from "express";
import { GroupModel } from "../../models/group";
import { error_400_id, error_500, colUser, ___issue___ } from "../../utils";

// GET
export const getAllGroups = async (_req: Request, res: Response) => {
	const groups = await GroupModel.find({});
	return res.status(200).json({
		data: groups,
		length: groups.length,
		message: "Groups retrieved successfully",
		success: true,
	});
};

export const getOneGroup_public = async (req: Request, res: Response) => {
	const { groupname } = req.params;
	// get a group and its users using mongoose
	const group = await GroupModel.aggregate([
		{ $match: { name: groupname } },
		{ $lookup: { from: colUser, localField: "name", foreignField: "group", as: "users" } },
		{ $unset: ["users.hash", "users.salt", "users.username", "users.email", "users.createdAt", "users.updatedAt"] },
	]).exec();

	if (group.length === 0)
		return res.status(422).json({
			data: null,
			message: `Group "${groupname}" not found`,
			success: false,
		});

	return res.status(200).json({
		data: group,
		message: `Group "${groupname}" retrieved successfully`,
		success: true,
	});
};

export const getOneGroup_protected = async (req: Request, res: Response) => {
	const { groupname } = req.params;
	// get a group and its users using mongoose
	const group = await GroupModel.aggregate([
		{ $match: { name: groupname } },
		{ $lookup: { from: "users", localField: "name", foreignField: "group", as: "users" } },
		{ $unset: ["users.hash", "users.salt"] },
	]).exec();

	if (group.length === 0)
		return res.status(422).json({
			data: null,
			message: `Group "${groupname}" not found`,
			success: false,
		});

	return res.status(200).json({
		data: group,
		message: `Group "${groupname}" retrieved successfully`,
		success: true,
	});
};

// POST
export const createGroup = async (req: Request, res: Response) => {
	const group = GroupModel.create(req.body);
	return res.status(!!group ? 201 : 500).json({
		data: group,
		message: !!group ? "Group created successfully" : `Unable to create group. If you think that this is a bug, please submit an issue at ${___issue___}`,
		success: !!group,
	});
};

// PUT
export const updateGroup = async (req: Request, res: Response) => {
	const { _id } = req.params;
	try {
		const group = await GroupModel.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true });
		return res.status(!!group ? 200 : 422).json({
			data: group,
			message: !!group ? "Group updated successfully" : `Fail to update. Group _id: "${_id}" not found`,
			success: !!group,
		});
	} catch (error) {
		if (error.name === "CastError") {
			return error_400_id(res, _id, "Group _id");
		} else {
			return error_500(res, error);
		}
	}
};

// DELETE
export const deleteGroup = async (req: Request, res: Response) => {
	const { _id } = req.params;
	try {
		const group = await GroupModel.findByIdAndRemove({ name: _id });
		return res.status(!!group ? 200 : 422).json({
			data: group,
			message: !!group ? "Group deleted successfully" : `Fail to delete group. Group _id: "${_id}" not found`,
			success: !!group,
		});
	} catch (error) {
		if (error.name === "CastError") {
			return error_400_id(res, _id, "Group _id");
		} else {
			return error_500(res, error);
		}
	}
};
