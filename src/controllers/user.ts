import { Request, Response } from "express";
import { userModel, validateQuery } from "../models/user";

const validatePasswordInputed = (password: string) => {
	let success = true;
	// validate password manually //
	if (!password) return { message: "Password is required", success: false };
	if (password.length < 8) return { message: "Password must be at least 8 characters long", success: false };
	if (password.length > 250) return { message: "Password must be at most 250 characters long", success: false };
	if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._-])[A-Za-z\d@$!%*?&._-]{8,}$/.test(password))
		return { message: "Password must be at least 8 characters long and contain at least one lowercase, one uppercase, one number and one special character (@$!%*?&._-)", success: false };

	return { message: "", success };
};

// GET
export const getAllUsers = async (_req: Request, res: Response) => {
	const users = await userModel.find({}).select("-hash -salt");
	return res.status(200).json({
		data: users,
		length: users.length,
		message: "Users retrieved successfully",
		success: true,
	});
};

export const getOneUser_public = async (req: Request, res: Response) => {
	const { username } = req.params;
	const user = await userModel.findOne({ username: username }).select("-hash -salt -role -username -email -createdAt -updatedAt");
	if (!user)
		return res.status(404).json({
			data: null,
			message: `User "${username}" not found`,
			success: false,
		});

	return res.status(200).json({
		data: user,
		message: `User "${username}" retrieved successfully`,
		success: true,
	});
};

export const getOneUser_protected = async (req: Request, res: Response) => {
	const { username } = req.params;
	const user = await userModel.findOne({ username: username }).select("-hash -salt");
	if (!user)
		return res.status(404).json({
			data: null,
			message: `User "${username}" not found`,
			success: false,
		});

	return res.status(200).json({
		data: user,
		message: `User "${username}" retrieved successfully`,
		success: true,
	});
};

// POST
export const createUser = async (req: Request, res: Response) => {
	// validate password manually //
	const { password } = req.body;
	const checkPass = validatePasswordInputed(password);
	if (!checkPass.success) return res.status(400).json(checkPass);

	// register user //
	const user = new userModel(req.body);
	user.setPassword(password);
	const dataSaved = await user.save({ validateBeforeSave: true });

	// @ts-ignore
	const { hash, salt, ...dataReturn } = dataSaved._doc;
	return res.status(!!dataSaved ? 201 : 200).json({
		data: dataReturn,
		message: !!dataSaved ? "User created successfully" : "Fail to create user",
		success: !!dataSaved, // read https://stackoverflow.com/questions/7452720/what-does-the-double-exclamation-operator-mean
	});
};

// PUT
export const updateUserData = async (req: Request, res: Response) => {
	const { username } = req.params;
	const { valid, queryData } = validateQuery(req.body); // extra validation (optional)
	if (!valid)
		return res.status(400).json({
			data: "Invalid or missing data",
			success: false,
		});

	// find and update while it's validated using mongoose
	const user = await userModel.findOneAndUpdate({ username: username }, queryData, { runValidators: true, new: true });
	return res.status(200).json({
		data: user ? user : `User "${username}" not found`,
		message: !!user ? "User updated successfully" : "Fail to update user",
		success: !!user,
	});
};

export const changePassword = async (req: Request, res: Response) => {
	const { username } = req.params;
	const { password } = req.body;
	const checkPass = validatePasswordInputed(password);
	if (!checkPass.success) return res.status(400).json(checkPass);

	// find and update while it's validated using mongoose
	const user = await userModel.findOne({ username: username });
	if (!user)
		return res.status(404).json({
			data: null,
			message: "User not found",
			success: false,
		});

	user.setPassword(password);
	const dataSaved = await user.save({ validateBeforeSave: true });

	// @ts-ignore
	const { hash, salt, ...dataReturn } = dataSaved._doc;
	return res.status(200).json({
		data: dataReturn,
		message: !!dataSaved ? "Password updated successfully" : "Fail to update password",
		success: !!dataSaved,
	});
};

// DELETE
export const deleteUser = async (req: Request, res: Response) => {
	const { username } = req.params;
	const user = await userModel.findOneAndDelete({ username: username }).select("-hash -salt");
	return res.status(200).json({
		data: user ? user : `User "${username}" not found`,
		message: !!user ? "User deleted successfully" : "Fail to delete user ",
		success: !!user,
	});
};
