import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieparser from "cookie-parser";
import path from "path";
import expressSession from "express-session";
import { ___prod___ } from "./utils/constants";
import { NotFoundError } from "./utils/notFoundError";
import { ExpressErrorHandler } from "./utils/ExpressErrorHandler";
import { authRouter } from "./api/v1/auth";
import { userRouter } from "./api/v1/user";
import { groupRouter } from "./api/v1/group";

dotenv.config();
const app = express();
const sessionCfg = {
	secret: process.env.SESSION_SECRET!,
	cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 /* 1 week */, secure: ___prod___ },
	resave: false,
	saveUninitialized: false,
};

app.set("trust proxy", true);

// middleware
app.use(morgan("dev")); // logger, use preset dev
app.use(helmet()); // security
app.use(cors()); // cors (cross-origin resource sharing)
app.use(express.json()); // json parser / body parser for post request except html post form
app.use(express.urlencoded({ extended: false })); // urlencoded parser / body parser for html post form.
app.use(cookieparser()); // cookie parser
app.use(express.static(path.join(__dirname, "../public"))); // static files
app.use(expressSession(sessionCfg)); // session

// --------------------------------------------------
// V1
app.use("/v1/auth", authRouter);
app.use("/v1/user", userRouter);
app.use("/v1/group", groupRouter);

// --------------------------------------------------
// ! Not found page error
app.all("*", NotFoundError);

// ! Error Handlers
app.use(ExpressErrorHandler);

export default app;

// TODO: REPLACE OR DELETE .placeholder after development is done
