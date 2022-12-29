const express = require("express");
const mongoose = require("mongoose");
const logger = require("morgan");
const authRouter = require("./routes/auth.routes");
const tourRouter = require("./routes/tour.routes");

require("dotenv").config();

const PORT = process.env.PORT || 9000;

const app = express();

const DB = process.env.MONGO_URI;
mongoose.connect(DB, {
  useNewUrlParser: true,
});

const cors = require("cors");

app.use(cors());
app.use(logger("dev"));

// Middleware of request time
var requestTime = function (req, res, next) {
  req.requestTime = new Date().toISOString();
  next();
};

app.use(requestTime);

app.use("/api/v1/auth", authRouter);
// app.use("/api/v1/users", tourRouter);
app.use("/api/v1/tours", tourRouter);

app.get("/", (req, res) => {
  res.end("Hello");
});
// Middleware for 404 routes
app.all("*", (req, res, next) => {
  next(new Error(`Can’t find ${req.originalUrl} on this server`));
});

const server = app.listen(PORT, () => {
  // const { address, port } = server.address();
  console.log(`App running at http://127.0.0.1:${PORT}`); // eslint-disable-line
  // console.log(server); // eslint-disable-line
});
