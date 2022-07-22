import { Request, Response, NextFunction } from "express";
import { userModel } from "../../models/user";

export const validatePassword = async (username: string, password: string) => {
	const userGet = await userModel.findOne({ username: username });
	return { user: userGet, valid: userGet ? userGet.validatePassword(password) : false };
};

export const validateLoggedIn = async (req: Request, res: Response, next: NextFunction) => {
	if (req.session.user) {
		next();
	} else {
		res.status(401).json({ message: "Need to be logged in" });
	}
};

export const validateAdmin = async (req: Request, res: Response, next: NextFunction) => {
	if (req.session.user && req.session.role?.includes("admin")) {
		next();
	} else {
		res.status(403).json({ message: "Need to be admin" });
	}
};

export const validateEditor = async (req: Request, res: Response, next: NextFunction) => {
	if (req.session.user && (req.session.role?.includes("editor") || req.session.role?.includes("admin"))) {
		next();
	} else {
		res.status(403).json({ message: "Need to be editor" });
	}
};

export const validateForumMod = async (req: Request, res: Response, next: NextFunction) => {
	if (req.session.user && (req.session.role?.includes("forum_moderator") || req.session.role?.includes("admin"))) {
		next();
	} else {
		res.status(403).json({ message: "Need to be forum moderator" });
	}
};

export const validateShortlinkMod = async (req: Request, res: Response, next: NextFunction) => {
	if (req.session.user && (req.session.role?.includes("shortlink_moderator") || req.session.role?.includes("admin"))) {
		next();
	} else {
		res.status(403).json({ message: "Need to be shortlink moderator" });
	}
};

export const login = async (req: Request, res: Response) => {
	const { username, password } = req.body;
	if (!username) return res.status(400).json({ message: "Username is required", success: false });
	if (!password) return res.status(400).json({ message: "Password is required", success: false });

	const { user, valid } = await validatePassword(username, password);
	if (!user) return res.status(401).json({ message: "Invalid username or password", success: false });
	if (!valid) return res.status(401).json({ message: "Invalid username or password", success: false });

	// save session
	req.session.userId = user._id;
	req.session.user = username;
	req.session.role = user.role;

	return res.status(200).json({
		message: "Login successful",
		success: true,
	});
};

export const logout = async (req: Request, res: Response) => {
	req.session.destroy((err) => {
		if (err) return res.status(500).json({ message: `Error logging out. ${err}`, success: false });

		return res.status(200).json({
			message: "Logout successful",
			success: true,
		});
	});
};

export const check = async (req: Request, res: Response) => {
	if (req.session.user) {
		return res.status(200).json({
			message: "Logged in",
			success: true,
		});
	} else {
		return res.status(200).json({
			message: "Not logged in",
			success: false,
		});
	}
};
