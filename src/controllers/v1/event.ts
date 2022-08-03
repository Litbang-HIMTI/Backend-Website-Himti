import { Request, Response } from "express";
import { Types } from "mongoose";
import { eventModel, eventRevisionModel, IEventModel, IEventRevisionModel } from "../../models/event";
import { error_400_id, error_500, ___issue___, colUser, colEvent, unsetAuthorFields } from "../../utils";

// --------------------------------------------------------------------------------------------
// EVENT
// GET
export const getAllEvents = async (req: Request, res: Response) => {
	const count = await eventModel.countDocuments().exec();
	const perPage = parseInt(req.query.perPage as string) || count || 15; // no perPage means get all
	const page = parseInt(req.query.page as string) - 1 || 0;

	const events = (await eventModel
		.aggregate([
			{ $match: {} },
			{ $sort: { createdAt: -1 } },
			{ $skip: perPage * page },
			{ $limit: perPage },
			{ $lookup: { from: colUser, localField: "author", foreignField: "_id", as: "author" } },
			{ $unset: unsetAuthorFields("author") },
		])
		.exec()) as IEventModel[];

	return res.status(200).json({
		data: events,
		page: page + 1,
		pages: Math.ceil(count / perPage),
		message: "Events retrieved successfully",
		success: true,
	});
};

export const getOneEvent = async (req: Request, res: Response) => {
	const { _id } = req.params;
	try {
		const event = (
			await eventModel
				.aggregate([
					{ $match: { _id: Types.ObjectId(_id) } },
					{ $lookup: { from: colUser, localField: "author", foreignField: "_id", as: "author" } },
					{ $unset: unsetAuthorFields("author") },
				])
				.exec()
		)[0] as IEventModel;
		console.log(event);

		return res.status(!!event ? 200 : 422).json({
			data: event,
			message: !!event ? "Event retrieved successfully" : `Event _id: "${_id}" not found`,
			success: !!event,
		});
	} catch (error) {
		if (error.name === "CastError") {
			return error_400_id(res, _id, "Event _id");
		} else {
			return error_500(res, error);
		}
	}
};

// POST
export const createEvent = async (req: Request, res: Response) => {
	const event = await eventModel.create({ ...req.body, author: req.session.userId });
	return res.status(!!event ? 201 : 500).json({
		data: event,
		message: !!event ? "Event created successfully" : `Unable to create event. If you think that this is a bug, please submit an issue at ${___issue___}`,
		success: true,
	});
};

// PUT
export const updateEvent = async (req: Request, res: Response) => {
	const { _id } = req.params;
	let revisionPost;
	try {
		const event = await eventModel.findByIdAndUpdate(_id, { ...req.body, author: req.session.userId! }, { runValidators: true, new: true });
		if (event) {
			const revision = await eventRevisionModel.find({ eventId: _id }).select("-_id -__v -createdAt -updatedAt").sort({ revision: -1 /* desc */ }).limit(1);
			if (revision.length > 0) {
				// update revision by spread and save new revision with incremented revision number
				revisionPost = await eventRevisionModel.create({
					...(event._doc as IEventRevisionModel),
					author: Types.ObjectId(req.session.userId!),
					revision: revision[0].revision + 1,
					eventId: Types.ObjectId(_id),
				});
			} else {
				// create new revision with revision number 1
				revisionPost = await eventRevisionModel.create({ ...(event._doc as IEventRevisionModel), author: Types.ObjectId(req.session.userId!), revision: 1, eventId: Types.ObjectId(_id) });
			}
		}

		return res.status(!!event ? 200 : 422).json({
			data: event,
			message: !!event
				? `Successfully updated event${!!revisionPost ? ` and successfully moved old event post to revision history` : ` fail to move old event post to revision history`}`
				: `Event _id: "${_id}" not found`,
			success: !!event,
		});
	} catch (error) {
		if (error.name === "CastError") {
			return error_400_id(res, _id, "Event _id");
		} else {
			return error_500(res, error);
		}
	}
};

// DELETE
export const deleteEvent = async (req: Request, res: Response) => {
	const { _id } = req.params;
	try {
		const event = await eventModel.findByIdAndDelete(_id);
		const { deletedCount, ok } = await eventRevisionModel.deleteMany({ eventId: Types.ObjectId(_id) });
		return res.status(!!event ? 200 : 422).json({
			data: event,
			message: !!event
				? `Successfully deleted event post${ok ? ` and its revision history (Got ${deletedCount} deleted)` : " and fail to delete version history (Operations failed)"}`
				: `Event _id: "${_id}" not found`,
			success: !!event,
		});
	} catch (error) {
		if (error.name === "CastError") {
			return error_400_id(res, _id, "Event _id");
		} else {
			return error_500(res, error);
		}
	}
};

// --------------------------------------------------------------------------------------------
// EVENT REVISION
// GET
export const getAllEventRevisions = async (req: Request, res: Response) => {
	const count = await eventRevisionModel.countDocuments().exec();
	const perPage = parseInt(req.query.perPage as string) || count || 15; // no perPage means get all
	const page = parseInt(req.query.page as string) - 1 || 0;

	const eventRevisions = (await eventRevisionModel.aggregate([
		{ $match: {} },
		{ $sort: { createdAt: -1 } },
		{ $skip: page * perPage },
		{ $limit: perPage },
		{ $lookup: { from: colUser, localField: "author", foreignField: "_id", as: "author" } },
		{ $unset: unsetAuthorFields("author") },
		{ $lookup: { from: colEvent, localField: "eventId", foreignField: "_id", as: "event" } },
	])) as IEventRevisionModel[];

	return res.status(200).json({
		data: eventRevisions,
		page: page + 1,
		pages: Math.ceil(count / perPage),
		message: "Event revisions retrieved successfully",
		success: true,
	});
};

export const getEventRevisionsByEventId = async (req: Request, res: Response) => {
	const { _id } = req.params;
	try {
		const count = await eventRevisionModel.countDocuments({ eventId: Types.ObjectId(_id) }).exec();
		const perPage = parseInt(req.query.perPage as string) || count || 15; // no perPage means get all
		const page = parseInt(req.query.page as string) - 1 || 0;

		const eventRevisions = (await eventRevisionModel
			.aggregate([
				{ $match: { eventId: Types.ObjectId(_id) } },
				{ $sort: { createdAt: -1 } },
				{ $skip: page * perPage },
				{ $limit: perPage },
				{ $lookup: { from: colUser, localField: "author", foreignField: "_id", as: "author" } },
				{ $unset: unsetAuthorFields("author") },
				{ $lookup: { from: colEvent, localField: "eventId", foreignField: "_id", as: "event" } },
			])
			.exec()) as IEventRevisionModel[];

		return res.status(200).json({
			data: eventRevisions,
			page: page + 1,
			pages: Math.ceil(count / perPage),
			message: "Event revisions retrieved successfully",
			success: true,
		});
	} catch (error) {
		if (error.name === "CastError") {
			return error_400_id(res, _id, "eventId");
		} else {
			return error_500(res, error);
		}
	}
};

export const getOneEventRevision = async (req: Request, res: Response) => {
	const { _id } = req.params;
	try {
		const eventRevision = (
			await eventRevisionModel
				.aggregate([
					{ $match: { _id: Types.ObjectId(_id) } },
					{ $lookup: { from: colUser, localField: "author", foreignField: "_id", as: "author" } },
					{ $unset: unsetAuthorFields("author") },
				])
				.exec()
		)[0] as IEventRevisionModel;

		return res.status(!!eventRevision ? 200 : 422).json({
			data: eventRevision,
			message: !!eventRevision ? "Event revision retrieved successfully" : `Event revision _id: "${_id}" not found`,
			success: !!eventRevision,
		});
	} catch (error) {
		if (error.name === "CastError") {
			return error_400_id(res, _id, "Event revision _id");
		} else {
			return error_500(res, error);
		}
	}
};

// POST
export const createEventRevision = async (req: Request, res: Response) => {
	const eventRevision = await eventRevisionModel.create(req.body);
	return res.status(!!eventRevision ? 201 : 500).json({
		data: eventRevision,
		message: !!eventRevision ? "Event revision created successfully" : `Unable to create event revision. If you think that this is a bug, please submit an issue at ${___issue___}`,
		success: !!eventRevision,
	});
};

// PUT
export const updateEventRevision = async (req: Request, res: Response) => {
	const { _id } = req.params;
	try {
		const eventRevision = await eventRevisionModel.findByIdAndUpdate(_id, req.body, { runValidators: true, new: true });
		return res.status(!!eventRevision ? 200 : 422).json({
			data: eventRevision,
			message: !!eventRevision ? "Event revision updated successfully" : `Fail to update. Event revision _id: "${_id}" not found`,
			success: !!eventRevision,
		});
	} catch (error) {
		if (error.name === "CastError") {
			return error_400_id(res, _id, "Event revision _id");
		} else {
			return error_500(res, error);
		}
	}
};

// DELETE
export const deleteEventRevision = async (req: Request, res: Response) => {
	const { _id } = req.params;
	try {
		const eventRevision = await eventRevisionModel.findByIdAndDelete(_id);
		return res.status(!!eventRevision ? 200 : 422).json({
			data: eventRevision,
			message: !!eventRevision ? "Event revision deleted successfully" : `Event revision _id: "${_id}" not found`,
			success: !!eventRevision,
		});
	} catch (error) {
		if (error.name === "CastError") {
			return error_400_id(res, _id, "Event revision _id");
		} else {
			return error_500(res, error);
		}
	}
};
