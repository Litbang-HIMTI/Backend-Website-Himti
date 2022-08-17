import { Request, Response } from "express";
import { IUserModel, userModel, validateQuery } from "../../models/user";
import { colGroup, error_400_id, error_500, ___issue___ } from "../../utils";

const validatePasswordInputed = (password: string) => {
	// validate password manually //
	if (!password) return { data: null, message: "Password is required", success: false };
	if (password.length < 8) return { data: null, message: "Password must be at least 8 characters long", success: false };
	if (password.length > 250) return { data: null, message: "Password must be at most 250 characters long", success: false };
	if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._-])[A-Za-z\d@$!%*?&._-]{8,}$/.test(password))
		return {
			data: null,
			message: "Password must be at least 8 characters long and contain at least one lowercase, one uppercase, one number and one special character (@$!%*?&._-)",
			success: false,
		};

	return { data: null, message: "", success: true };
};

// GET
export const getAllUsers = async (req: Request, res: Response) => {
	const count = await userModel.countDocuments().exec();
	const perPage = parseInt(req.query.perPage as string) || count || 15; // no perPage means get all
	const page = parseInt(req.query.page as string) - 1 || 0;

	const users = (await userModel
		.aggregate([
			{ $match: {} },
			{ $sort: { createdAt: -1 } },
			{ $skip: perPage * page },
			{ $limit: perPage },
			{ $unset: ["hash", "salt"] },
			{ $lookup: { from: colGroup, localField: "group", foreignField: "_id", as: "group" } },
		])
		.exec()) as IUserModel[];

	return res.status(200).json({
		data: users,
		page: page + 1,
		pages: Math.ceil(count / perPage),
		message: "Users retrieved successfully",
		success: true,
	});
};

export const getOneUser_public = async (req: Request, res: Response) => {
	const { username } = req.params;
	const user = (
		await userModel
			.aggregate([
				{ $match: { username: username } },
				{ $unset: ["hash", "salt", "createdAt", "updatedAt"] },
				{ $lookup: { from: colGroup, localField: "group", foreignField: "_id", as: "group" } },
			])
			.exec()
	)[0] as IUserModel;

	if (!user)
		return res.status(422).json({
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
	const user = (
		await userModel
			.aggregate([{ $match: { username: username } }, { $unset: ["hash", "salt"] }, { $lookup: { from: colGroup, localField: "group", foreignField: "_id", as: "group" } }])
			.exec()
	)[0] as IUserModel;

	if (!user)
		return res.status(422).json({
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

	// return response //
	// eslint-disable-next-line
	const { hash, salt, ...dataReturn } = dataSaved._doc;
	return res.status(!!dataSaved ? 201 : 500).json({
		data: dataReturn,
		message: !!dataSaved ? "User created successfully" : `Unable to create user. If you think that this is a bug, please submit an issue at ${___issue___}`,
		success: !!dataSaved, // read https://stackoverflow.com/questions/7452720/what-does-the-double-exclamation-operator-mean
	});
};

// PUT
export const updateUserData = async (req: Request, res: Response) => {
	const { _id } = req.params;
	const { valid, queryData } = validateQuery(req.body); // extra validation (optional for more security) //
	if (!valid)
		return res.status(400).json({
			data: "Invalid or missing data",
			success: false,
		});

	try {
		const user = await userModel.findByIdAndUpdate(_id, queryData, { new: true }).select("-hash -salt");
		return res.status(!!user ? 200 : 422).json({
			data: user,
			message: !!user ? `User ${user.username} _id "${_id}" updated successfully` : `Unable to update user. User _id: "${_id}" not found`,
			success: !!user,
		});
	} catch (error) {
		if (error.name === "CastError") {
			return error_400_id(res, _id, "User _id");
		} else {
			return error_500(res, error);
		}
	}
};

export const changePassword = async (req: Request, res: Response) => {
	const { username } = req.params;
	const { password } = req.body;
	const checkPass = validatePasswordInputed(password);
	if (!checkPass.success) return res.status(400).json(checkPass);

	const user = await userModel.findOne({ username: username });
	if (!user)
		return res.status(422).json({
			data: null,
			message: "User not found",
			success: false,
		});

	user.setPassword(password);
	const dataSaved = await user.save({ validateBeforeSave: true });

	// eslint-disable-next-line
	const { hash, salt, ...dataReturn } = dataSaved._doc;
	return res.status(!!dataSaved ? 200 : 500).json({
		data: dataReturn,
		message: !!dataSaved ? "Password updated successfully" : `Unable to update user password. If you think that this is a bug, please submit an issue at ${___issue___}`,
		success: !!dataSaved,
	});
};

// DELETE
export const deleteUser = async (req: Request, res: Response) => {
	const { _id } = req.params;
	const user = await userModel.findOneAndDelete({ _id: _id }).select("-hash -salt");
	return res.status(!!user ? 200 : 422).json({
		data: user,
		message: !!user ? "User deleted successfully" : `Fail to delete user. User _id: "${_id}" not found`,
		success: !!user,
	});
};
