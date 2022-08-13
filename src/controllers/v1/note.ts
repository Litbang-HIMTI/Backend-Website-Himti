import { Request, Response } from "express";
import { Types } from "mongoose";
import { noteModel, INoteModel } from "../../models/note";
import { error_400_id, error_500, colUser, ___issue___, unsetAuthorFields } from "../../utils";

// GET
export const getAllNotes = async (req: Request, res: Response) => {
	const count = await noteModel.countDocuments().exec();
	const perPage = parseInt(req.query.perPage as string) || count || 15; // no perPage means get all
	const page = parseInt(req.query.page as string) - 1 || 0;
	const byPosition = req.query.byPosition === "true";

	const aggregations: any[] = [
		{ $match: {} },
		{ $skip: perPage * page },
		{ $limit: perPage },
		{ $lookup: { from: colUser, localField: "author", foreignField: "_id", as: "author" } },
		{ $unset: unsetAuthorFields("author") },
		{ $lookup: { from: colUser, localField: "editedBy", foreignField: "_id", as: "editedBy" } },
		{ $unset: unsetAuthorFields("editedBy") },
	];

	if (byPosition) aggregations.push({ $sort: { position: 1 } });
	else aggregations.push({ $sort: { createdAt: -1 } });

	const notes = (await noteModel.aggregate(aggregations).exec()) as INoteModel[];

	return res.status(200).json({
		data: notes,
		page: page + 1,
		pages: Math.ceil(count / perPage),
		message: "Notes retrieved successfully",
		success: true,
	});
};

export const getOneNote = async (req: Request, res: Response) => {
	const { _id } = req.params;
	// get a note and its users using mongoose
	try {
		const note = (
			await noteModel
				.aggregate([
					{ $match: { _id: Types.ObjectId(_id) } },
					{ $lookup: { from: colUser, localField: "author", foreignField: "_id", as: "author" } },
					{ $unset: unsetAuthorFields("author") },
					{ $lookup: { from: colUser, localField: "editedBy", foreignField: "_id", as: "editedBy" } },
					{ $unset: unsetAuthorFields("editedBy") },
				])
				.exec()
		)[0] as INoteModel;

		return res.status(!!note ? 200 : 422).json({
			data: note,
			message: !!note ? `Note "${_id}" retrieved successfully` : `Note "${_id}" not found`,
			success: !!note,
		});
	} catch (error) {
		if (error.name === "CastError") {
			return error_400_id(res, _id, "Note _id");
		} else {
			return error_500(res, error);
		}
	}
};

// POST
export const createNote = async (req: Request, res: Response) => {
	// first get current notes max position
	const maxPosition = await noteModel.find({}).sort({ position: -1 }).limit(1).exec();
	const position = maxPosition.length ? maxPosition[0].position + 1 : 1;

	const note = await noteModel.create({ ...req.body, position: position, author: req.session.userId });
	return res.status(!!note ? 201 : 500).json({
		data: note,
		message: !!note ? "Note created successfully" : `Unable to create note. If you think that this is a bug, please submit an issue at ${___issue___}`,
		success: !!note,
	});
};

// PUT
export const updateNote = async (req: Request, res: Response) => {
	const { _id } = req.params;
	try {
		const note = await noteModel.findByIdAndUpdate(_id, { ...req.body, editedBy: req.session.userId }, { new: true, runValidators: true });
		return res.status(!!note ? 200 : 422).json({
			data: note,
			message: !!note ? "Note updated successfully" : `Fail to update. Note _id: "${_id}" not found`,
			success: !!note,
		});
	} catch (error) {
		if (error.name === "CastError") {
			return error_400_id(res, _id, "Note _id");
		} else {
			return error_500(res, error);
		}
	}
};

// DELETE
export const deleteNote = async (req: Request, res: Response) => {
	const { _id } = req.params;
	try {
		const note = await noteModel.findByIdAndRemove(_id);
		return res.status(!!note ? 200 : 422).json({
			data: note,
			message: !!note ? "Note deleted successfully" : `Fail to delete note. Note _id: "${_id}" not found`,
			success: !!note,
		});
	} catch (error) {
		if (error.name === "CastError") {
			return error_400_id(res, _id, "Note _id");
		} else {
			return error_500(res, error);
		}
	}
};
