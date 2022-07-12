import { Request, Response } from "express";
import { userModel } from "../models/user";

// User API Routes must be protected. Only authenticated users can access these routes.
// GET
export const getAllUsers = async (_req: Request, res: Response) => {
	const users = await userModel.find({});
	res.json({
		data: users,
		length: users.length,
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

// PUT update

// DELETE delete
