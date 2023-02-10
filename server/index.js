const express = require("express");
const mongoose = require("mongoose");
const logger = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const globalErrorHandler = require("./middlewares/error.handler");
const AppError = require("./utils/app-error");
const authRouter = require("./routes/auth.routes");
const userRouter = require("./routes/user.routes");
const tourRouter = require("./routes/tour.routes");

require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

process.on("uncaughtException", (err) => {
  console.error(err);
  process.exit(1);
});

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  handler: () =>
    new AppError(
      "Too many requests from this client, please try again later",
      429
    ),
});

const PORT = process.env.PORT || 9000;

const app = express();
// parse body json data with limit of 10kb
app.use(express.json({ limit: "10kb" }));
// parse data from urlencoded form
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
// set security HTTP headers

// https://www.npmjs.com/package/helmet
// https://expressjs.com/en/advanced/best-practice-security.html
app.use(helmet());
const DB = process.env.MONGO_URI;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connection successful!")); // eslint-disable-line

const cors = require("cors");
app.use("/api", limiter);
app.use(cors());
// Data sanitization against NoSQL query injection
app.use(mongoSanitize());
app.use(xss());

// protect against parameter pollution
// add the parameters you want to whitelist (to be duplicated in the query string)
app.use(
  hpp({
    whitelist: [],
  })
);
app.use(logger("dev"));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/tours", tourRouter);

// Middleware for 404 routes
app.all("*", (req, res, next) => {
  next(new AppError(`Can’t find ${req.originalUrl} on this server`));
});

// error handling
app.use(globalErrorHandler);

const server = app.listen(PORT, () => {
  // const { address, port } = server.address();
  console.log(`App running at http://localhost:${PORT}`); // eslint-disable-line
  // console.log(server); // eslint-disable-line
});

process.on("unhandledRejection", (err) => {
  console.error(err);

  server.close(() => process.exit(1));
});
