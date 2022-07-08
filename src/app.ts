import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieparser from "cookie-parser";
import path from "path";
import { apiRoutes } from "./api";
import { NotFoundError } from "./utils/notFoundError";
import { ExpressErrorHandler } from "./utils/ExpressErrorHandler";

dotenv.config();
const app = express();

app.set("trust proxy", true);
app.use(morgan("dev")); // logger
app.use(helmet()); // security
app.use(cors()); // cors (cross-origin resource sharing)
app.use(express.json()); // json parser
app.use(express.urlencoded({ extended: true })); // urlencoded parser
app.use(cookieparser()); // cookie parser
app.use(express.static(path.join(__dirname, "public"))); // static files

// express.json() is a body parser for post request except html post form
// and express.urlencoded({extended: false}) is a body parser for html post form.

// --------------------------------------------------
app.get("/", (_req, res) => {
	res.json({
		message: "Hello world",
	});
});

app.use("/api", apiRoutes);

// ! Not found page error
app.all("*", NotFoundError);

// ! Error Handlers
app.use(ExpressErrorHandler);

export default app;
