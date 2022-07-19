import "express-async-errors";
import mongoose from "mongoose";
import http from "http";
import app from "./app";
import { ___prod___ } from "./utils/constants";

(async () => {
	try {
		if (!process.env.SESSION_SECRET) throw new Error('??>> {" SESSION_SECRET must be defined!! "} ');
		if (!process.env.MONGO_URI) throw new Error('??>> {" MONGO_URI must be defined!! "} ');
		await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
			useFindAndModify: false,
		});
		mongoose.set("debug", ___prod___);

		const server = http.createServer(app);
		const port = process.env.PORT || 42069;
		server.listen(port, () => {
			console.log(`~~~~ Server Started ~~~~`);
			if (!___prod___) {
				console.log(`**** VISIT: http://localhost:${port} ****`);
			}
		});
		server.on("error", (error: NodeJS.ErrnoException) => {
			if (error.syscall !== "listen") {
				throw error;
			}

			var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

			// handle specific listen errors with friendly messages
			switch (error.code) {
				case "EACCES":
					console.error(bind + " requires elevated privileges");
					process.exit(1);
					break;
				case "EADDRINUSE":
					console.error(bind + " is already in use");
					process.exit(1);
					break;
				default:
					throw error;
			}
		});
	} catch (e) {
		console.error(e.message);
		process.exit(1);
	}
})();
