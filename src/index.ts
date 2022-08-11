import "express-async-errors"; // this is very important to make sure that async error is handled by the ExpressErrorHandler
import mongoose from "mongoose";
import http from "http";
import app from "./app";
import { ___prod___ } from "./utils/constants";

const onError = (error: NodeJS.ErrnoException, port: string | number) => {
	if (error.syscall !== "listen") throw error;
	let bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

	// handle specific listen errors with friendly messages
	switch (error.code) {
		case "EACCES":
			console.error(bind + " requires elevated privileges");
			process.exit(1);
		case "EADDRINUSE":
			console.error(bind + " is already in use");
			process.exit(1);
		default:
			throw error;
	}
};

(async () => {
	try {
		// --------------------------------------------------
		// check env
		if (!process.env.P_ITERATION) throw new Error('??>>{" P_ITERATION is not set "}" ');
		if (!process.env.P_LENGTH) throw new Error('??>>{" P_LENGTH is not set "}" ');
		if (!process.env.P_HASH) throw new Error('??>>{" P_HASH is not set "}" ');
		if (!process.env.SESSION_SECRET) throw new Error('??>> {" SESSION_SECRET must be defined!! "} ');
		if (!process.env.MONGO_URI) throw new Error('??>> {" MONGO_URI must be defined!! "} ');
		// --------------------------------------------------
		// connect to mongo
		await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
			useFindAndModify: false,
			dbName: ___prod___ ? process.env.DB_NAME : process.env.DB_NAME + "_dev",
		});
		mongoose.set("debug", ___prod___);
		// @ts-ignore
		mongoose.pluralize(null); // disable pluralize

		// --------------------------------------------------
		const server = http.createServer(app);
		const port = process.env.PORT || 42069;
		server.listen(port, () => {
			console.log(`~~~~ Server Started ~~~~`);
			if (!___prod___) {
				console.log(`**** VISIT: http://localhost:${port} ****`);
			}
		});
		server.on("error", (error: NodeJS.ErrnoException) => onError(error, port));
	} catch (e) {
		console.error(e.message);
		process.exit(1);
	}
})();
