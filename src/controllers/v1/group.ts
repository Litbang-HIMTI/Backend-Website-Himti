import { Request, Response } from "express";
import { Types } from "mongoose";
import { groupModel, IGroupModel } from "../../models/group";
import { userModel } from "../../models/user";
import { colUser, ___issue___, unsetAuthorFields } from "../../utils";

// GET
interface IGroupCount {
	_id: string;
	count: number;
}

export const getAllGroups = async (req: Request, res: Response) => {
	const count = await groupModel.countDocuments().exec();
	const perPage = parseInt(req.query.perPage as string) || count || 15; // no perPage means get all
	const page = parseInt(req.query.page as string) - 1 || 0;

	// no need to project user for group list
	const groupsData = (await groupModel.aggregate([{ $match: {} }, { $sort: { createdAt: -1 } }, { $skip: perPage * page }, { $limit: perPage }]).exec()) as IGroupModel[];

	// get the count of each user's groups
	const userGroups = (await userModel.aggregate([{ $match: {} }, { $unwind: "$group" }, { $group: { _id: "$group", count: { $sum: 1 } } }]).exec()) as IGroupCount[];

	const groups = groupsData.map((group) => {
		const userGroup = userGroups.find((userGroup) => userGroup._id.toString() === group._id.toString())!;
		return { ...group, count: userGroup && userGroup.count ? userGroup.count : 0 };
	});

	return res.status(200).json({
		data: groups,
		page: page + 1,
		pages: Math.ceil(count / perPage),
		message: "Groups retrieved successfully",
		success: true,
	});
};

export const getOneGroup_public = async (req: Request, res: Response) => {
	const { _id } = req.params;
	// get a group and its users using mongoose
	const group = (
		await groupModel
			.aggregate([{ $match: { _id: Types.ObjectId(_id) } }, { $lookup: { from: colUser, localField: "name", foreignField: "group", as: "users" } }, { $unset: unsetAuthorFields("users") }])
			.exec()
	)[0] as IGroupModel;

	return res.status(!!group ? 200 : 422).json({
		data: group,
		message: !!group ? `Group "${_id}" retrieved successfully` : `Group "${_id}" not found`,
		success: !!group,
	});
};

export const getOneGroup_protected = async (req: Request, res: Response) => {
	const { _id } = req.params;
	// get a group and its users using mongoose
	const group = (
		await groupModel
			.aggregate([{ $match: { _id: Types.ObjectId(_id) } }, { $lookup: { from: colUser, localField: "name", foreignField: "group", as: "users" } }, { $unset: ["users.hash", "users.salt"] }])
			.exec()
	)[0] as IGroupModel;

	return res.status(!!group ? 200 : 422).json({
		data: group,
		message: !!group ? `Group "${_id}" retrieved successfully` : `Group "${_id}" not found`,
		success: !!group,
	});
};

// POST
export const createGroup = async (req: Request, res: Response) => {
	const group = await groupModel.create(req.body);
	return res.status(!!group ? 201 : 500).json({
		data: group,
		message: !!group ? "Group created successfully" : `Unable to create group. If you think that this is a bug, please submit an issue at ${___issue___}`,
		success: !!group,
	});
};

// PUT
export const updateGroup = async (req: Request, res: Response) => {
	const { _id } = req.params;
	const group = await groupModel.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true });
	return res.status(!!group ? 200 : 422).json({
		data: group,
		message: !!group ? "Group updated successfully" : `Fail to update. Group _id: "${_id}" not found`,
		success: !!group,
	});
};

// DELETE
export const deleteGroup = async (req: Request, res: Response) => {
	const { _id } = req.params;
	const group = await groupModel.findByIdAndRemove(_id);
	return res.status(!!group ? 200 : 422).json({
		data: group,
		message: !!group ? "Group deleted successfully" : `Fail to delete group. Group _id: "${_id}" not found`,
		success: !!group,
	});
};
