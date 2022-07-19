import { Request, Response } from "express";
import { eventModel } from "../models/event";

// GET
export const getAllEvents = async (_req: Request, res: Response) => {
	const events = await eventModel.find();
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

			message: "Event retrieved successfully",
			success: true,
		});
	} catch (error) {
		if (error.name === "CastError") {
			return res.status(400).json({
				data: error,
				message: "Event not found",
				success: false,
			});
		} else {
			return res.status(500).json({
				data: error,

				message: "Server error",
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
		message: "Event created successfully",
		success: true,
	});
};

// PUT
export const updateEvent = async (req: Request, res: Response) => {
	const { _id } = req.params;
	try {
		const event = await eventModel.findByIdAndUpdate(_id, req.body, { new: true });
		return res.status(200).json({
			data: event,
			message: "Event updated successfully",
			success: true,
		});
	} catch (error) {
		if (error.name === "CastError") {
			return res.status(400).json({
				data: error,
				message: "Event not found",
				success: false,
			});
		} else {
			return res.status(500).json({
				data: error,
				message: "Server error",
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
			message: "Event deleted successfully",
			success: true,
		});
	} catch (error) {
		if (error.name === "CastError") {
			return res.status(400).json({
				data: error,
				message: "Event not found",
				success: false,
			});
		} else {
			return res.status(500).json({
				data: error,
				message: "Server error",
				success: false,
			});
		}
	}
};
