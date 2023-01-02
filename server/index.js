const express = require("express");
const mongoose = require("mongoose");
const logger = require("morgan");
const globalErrorHandler = require("./middlewares/error.handler");
const AppError = require("./utils/app-error");
const authRouter = require("./routes/auth.routes");
const userRouter = require("./routes/user.routes");
const tourRouter = require("./routes/tour.routes");

require("dotenv").config();

process.on("uncaughtException", (err) => {
  console.error(err);
  process.exit(1);
});

const PORT = process.env.PORT || 9000;

const app = express();

const DB = process.env.MONGO_URI;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => console.log("DB connection successful!")); // eslint-disable-line

const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(logger("dev"));

// Middleware of request time
var requestTime = function (req, res, next) {
  req.requestTime = new Date().toISOString();
  next();
};

app.use(requestTime);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/tours", tourRouter);

// Middleware for 404 routes
app.all("*", (req, res, next) => {
  next(new AppError(`Can’t find ${req.originalUrl} on this server`));
});

// error handling middleware in express
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
