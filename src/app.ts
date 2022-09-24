import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieparser from "cookie-parser";
import path from "path";
import expressSession from "express-session";
import MongoStore from "connect-mongo";
import "express-session";
declare module "express-session" {
	interface SessionData {
		userId: string;
		user: string;
		role: TRoles[];
	}
}
import { ___prod___ } from "./utils/constants";
import { NotFoundError } from "./utils/error/notFoundError";
import { ExpressErrorHandler } from "./utils/error/ExpressErrorHandler";
import { authRouterV1 } from "./api/v1/auth";
import { userRouterV1 } from "./api/v1/user";
import { groupRouterV1 } from "./api/v1/group";
import { shortlinkRouterV1 } from "./api/v1/shortlink";
import { eventRouterV1 } from "./api/v1/event";
import { blogRouterV1 } from "./api/v1/blog";
import { forumRouterV1 } from "./api/v1/forum";
import { forumCategoryRouterV1 } from "./api/v1/forum_category";
import { commentRouterV1 } from "./api/v1/comment";
import { noteRouterV1 } from "./api/v1/note";
import { TRoles } from "./models/user";

// --------------------------------------------------
dotenv.config(); // load env
const app = express();
const ttl = 24 * 60 * 60 * 1000 * 3; // 3 days
const sessionCfg: expressSession.SessionOptions = {
	secret: process.env.SESSION_SECRET!,
	cookie: { maxAge: ttl, secure: ___prod___, sameSite: ___prod___ ? "none" : "lax", httpOnly: false, domain: ___prod___ ? "himtiuinjkt.or.id" : undefined },
	resave: false,
	saveUninitialized: false,
	store: new MongoStore({
		// save session to db
		mongoUrl: process.env.MONGO_URI!,
		dbName: ___prod___ ? process.env.DB_NAME : process.env.DB_NAME + "_dev",
		collectionName: "sessions",
		ttl,
	}),
};
const whiteLists = ["https://himtiuinjkt.or.id"];

// --------------------------------------------------
// middleware
app.set("trust proxy", true);
app.use(morgan("dev")); // logger, use preset dev
app.use(helmet()); // security
app.use(
	cors({
		origin: ___prod___ ? whiteLists : true, // only allow whitelisted origin in production
		methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD", "DELETE"],
		credentials: true,
	})
); // cors (cross-origin resource sharing)
app.use(express.json()); // json parser / body parser for post request except html post form
app.use(express.urlencoded({ extended: false })); // urlencoded parser / body parser for html post form.
app.use(cookieparser()); // cookie parser
app.use(express.static(path.join(__dirname, "../public"))); // static files
app.use(expressSession(sessionCfg)); // session

// --------------------------------------------------
// API routes
// V1
app.use("/v1/auth", authRouterV1);
app.use("/v1/user", userRouterV1);
app.use("/v1/group", groupRouterV1);
app.use("/v1/shortlink", shortlinkRouterV1);
app.use("/v1/event", eventRouterV1);
app.use("/v1/blog", blogRouterV1);
app.use("/v1/forum", forumRouterV1);
app.use("/v1/forum_category", forumCategoryRouterV1);
app.use("/v1/comment", commentRouterV1);
app.use("/v1/note", noteRouterV1);

// --------------------------------------------------
// ! Not found page error
app.all("*", NotFoundError);

// ! Error Handlers
app.use(ExpressErrorHandler);

export default app;
