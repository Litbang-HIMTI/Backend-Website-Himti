import { Request, Response } from "express";
import { userModel, validateQuery } from "../models/user";

// GET
export const getAllUsers = async (_req: Request, res: Response) => {
	const users = await userModel.find({});
	res.status(200).json({
		data: users,
		length: users.length,
		success: true,
	});
};

export const getCertainUser = async (req: Request, res: Response) => {
	const { username } = req.params;
	const user = await userModel.findOne({ username });
	if (!user) {
		res.status(404).json({
			message: "User not found",
			success: false,
		});
		return;
	}
	res.status(200).json({
		data: user,
		success: true,
	});
};

// POST
export const createUser = async (req: Request, res: Response) => {
	const user = new userModel(req.body);
	const data = await user.save();
	res.status(201).json({
		data: user,
		created: !!data, // read https://stackoverflow.com/questions/7452720/what-does-the-double-exclamation-operator-mean
		success: true,
	});
};

// PUT
export const updateUser = async (req: Request, res: Response) => {
	const { username } = req.params;
	const { valid, queryData } = validateQuery(req.body); // extra validation (optional)
	if (!valid) {
		res.status(400).json({
			data: "Invalid or missing data",
			success: false,
		});
		return;
	}

	// find and update while it's validated using mongoose
	const user = await userModel.findOneAndUpdate({ username }, queryData, { runValidators: true, new: true });
	res.status(200).json({
		data: user ? user : `User ${username} not found`,
		success: !!user,
	});
};

// DELETE
export const deleteUser = async (req: Request, res: Response) => {
	const { username } = req.params;
	const user = await userModel.findOneAndDelete({ username });
	res.status(200).json({
		data: user,
		success: !!user,
	});
};
