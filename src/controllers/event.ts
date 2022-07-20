import { Request, Response } from "express";
import { eventModel } from "../models/event";

// GET
export const getAllEvents = async (_req: Request, res: Response) => {
	const events = await eventModel.find({});
	return res.status(200).json({
		data: events,
		length: events.length,
		message: "Events retrieved successfully",
		success: true,
	});
};

export const getOneEvent = async (req: Request, res: Response) => {
	const { _id } = req.params;
	try {
		const event = await eventModel.findById(_id);

		return res.status(200).json({
			data: event,
			message: !!event ? "Event retrieved successfully" : `Event _id: "${_id}" not found`,
			success: !!event,
		});
	} catch (error) {
		if (error.name === "CastError") {
			return res.status(400).json({
				data: null,
				message: `Event _id: "${_id}" not found`,
				success: false,
			});
		} else {
			return res.status(500).json({
				data: error,
				message: "Server error! If you think that this is a bug, please submit an issue at https://github.com/Litbang-HIMTI/Backend-Website-Himti/issues",
				success: false,
			});
		}
	}
};

// POST
export const createEvent = async (req: Request, res: Response) => {
	const event = await eventModel.create(req.body);
	return res.status(200).json({
		data: event,
		message: !!event ? "Event created successfully" : "Fail to create event",
		success: true,
	});
};

// PUT
export const updateEvent = async (req: Request, res: Response) => {
	const { _id } = req.params;
	try {
		const event = await eventModel.findByIdAndUpdate(_id, req.body, { runValidators: true, new: true });
		return res.status(200).json({
			data: event,
			message: !!event ? "Event updated successfully" : `Event _id: "${_id}" not found`,
			success: !!event,
		});
	} catch (error) {
		if (error.name === "CastError") {
			return res.status(400).json({
				data: null,
				message: `Event _id: "${_id}" not found`,
				success: false,
			});
		} else {
			return res.status(500).json({
				data: error,
				message: "Server error! If you think that this is a bug, please submit an issue at https://github.com/Litbang-HIMTI/Backend-Website-Himti/issues",
				success: false,
			});
		}
	}
};

// DELETE
export const deleteEvent = async (req: Request, res: Response) => {
	const { _id } = req.params;
	try {
		const event = await eventModel.findByIdAndDelete(_id);
		return res.status(200).json({
			data: event,
			message: !!event ? "Event deleted successfully" : `Event _id: "${_id}" not found`,
			success: !!event,
		});
	} catch (error) {
		if (error.name === "CastError") {
			return res.status(400).json({
				data: null,
				message: `Event _id: "${_id}" not found`,
				success: false,
			});
		} else {
			return res.status(500).json({
				data: error,
				message: "Server error! If you think that this is a bug, please submit an issue at https://github.com/Litbang-HIMTI/Backend-Website-Himti/issues",
				success: false,
			});
		}
	}
};
