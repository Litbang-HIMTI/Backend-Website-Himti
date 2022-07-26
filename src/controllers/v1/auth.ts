import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import { userModel } from "../../models/user";

export const validateLoggedIn = async (req: Request, res: Response, next: NextFunction) => {
	if (req.session && req.session.user) {
		next();
	} else {
		res.status(401).json({ data: null, message: "Need to be logged in", success: false });
	}
};

export const validateAdmin = async (req: Request, res: Response, next: NextFunction) => {
	if (req.session && req.session.user && req.session.role?.includes("admin")) {
		next();
	} else {
		res.status(403).json({ data: null, message: "Need to be admin", success: false });
	}
};

export const validateEditor = async (req: Request, res: Response, next: NextFunction) => {
	if (req.session && req.session.user && (req.session.role?.includes("editor") || req.session.role?.includes("admin"))) {
		next();
	} else {
		if (req.session && req.session.user) {
			res.status(403).json({ data: null, message: "Need to be editor", success: false });
		} else {
			res.status(401).json({ data: null, message: "Need to be logged in", success: false });
		}
	}
};

export const validateForumMod = async (req: Request, res: Response, next: NextFunction) => {
	if (req.session && req.session.user && (req.session.role?.includes("forum_moderator") || req.session.role?.includes("admin"))) {
		next();
	} else {
		if (req.session && req.session.user) {
			res.status(403).json({ data: null, message: "Need to be forum moderator", success: false });
		} else {
			res.status(401).json({ data: null, message: "Need to be logged in", success: false });
		}
	}
};

export const validateShortlinkMod = async (req: Request, res: Response, next: NextFunction) => {
	if (req.session && req.session.user && (req.session.role?.includes("shortlink_moderator") || req.session.role?.includes("admin"))) {
		next();
	} else {
		if (req.session && req.session.user) {
			res.status(403).json({ data: null, message: "Need to be shortlink moderator", success: false });
		} else {
			res.status(401).json({ data: null, message: "Need to be logged in", success: false });
		}
	}
};

export const credentialCheck = async (usernameEmail: string, password: string) => {
	const userGet = await userModel.findOne({ $or: [{ username: usernameEmail }, { email: usernameEmail }] });
	return { user: userGet, valid: userGet ? userGet.validatePassword(password) : false };
};

export const login = async (req: Request, res: Response) => {
	const { username, password } = req.body;
	if (!username) return res.status(400).json({ data: null, message: "Username/email is required", success: false });
	if (!password) return res.status(400).json({ data: null, message: "Password is required", success: false });

	// check if already logged in
	if (req.session && req.session.user) return res.status(400).json({ data: null, message: "Already logged in", success: false });

	const { user, valid } = await credentialCheck(username, password);
	if (!user) return res.status(401).json({ data: null, message: "Invalid username/email or password", success: false });
	if (!valid) return res.status(401).json({ data: null, message: "Invalid username/email or password", success: false });

	// save session
	req.session.userId = user._id;
	req.session.user = username;
	req.session.role = user.role;

	return res.status(200).json({
		data: null,
		message: "Login successful",
		success: true,
	});
};

export const logout = async (req: Request, res: Response) => {
	if (req.session)
		return req.session.destroy((err) => {
			if (err) return res.status(500).json({ data: null, message: `Error logging out. ${err}`, success: false });

			return res.status(200).json({
				data: null,
				message: "Logout successful",
				success: true,
			});
		});
	else return res.status(401).json({ data: null, message: "Not logged in", success: false });
};

export const check = async (req: Request, res: Response) => {
	if (req.session && req.session.user) {
		// get user data
		const user = await userModel.findById(Types.ObjectId(req.session.userId)).select("-salt -hash");
		return res.status(200).json({
			data: user,
			message: "Logged in",
			success: true,
		});
	} else {
		return res.status(401).json({ data: null, message: "Not logged in", success: false });
	}
};
