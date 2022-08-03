/**
 * Unset author fields
 */
export const unsetAuthorFields = (prefix: string) => {
	const unset = ["hash", "salt", "email", "createdAt", "updatedAt", "__v"];
	return unset.map((field) => `${prefix}.${field}`);
};
