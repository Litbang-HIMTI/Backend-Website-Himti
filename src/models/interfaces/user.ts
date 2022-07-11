/**
 * Roles interface
 * @export
 * user = "Site user. Can login, edit profile, view other users, and create/edit/delete their post and comment. Guest user can view profile, post comment but cannot their own forum post."
 * admin = "Do everything can access dashboard"
 * editor = "Content editor. Limited access to dashboard that includes blog & events"
 * forum_moderator = "Forum moderator. Limited access to dashboard that includes forum"
 */
export type TRoles = "user" | "admin" | "editor" | "forum_moderator";
export interface IRoles {
	[key: string]: TRoles;
}

export interface IUser {
	username: string;
	first_name: string;
	last_name: string;
	email: string;
	password: string;
	createdAt: Date;
	role: IRoles;
}
