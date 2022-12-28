const express = require("express");
const logger = require("morgan");
const tourRouter = require("./routes/tourRoutes");

const PORT = 9000;

const app = express();
const cors = require("cors");

app.use(cors());
app.use(logger("dev"));

// Middleware of request time
var requestTime = function (req, res, next) {
  req.requestTime = new Date().toISOString();
  next();
};

app.use(requestTime);

app.use("/api/v1/users", tourRouter);
app.use("/api/v1/tours", tourRouter);

// Middleware for 404 routes
app.all("*", (req, res, next) => {
  next(new Error(`Can’t find ${req.originalUrl} on this server`));
});

const server = app.listen(PORT, () => {
  // const { address, port } = server.address();
  console.log(`App running at http://127.0.0.1:${PORT}`); // eslint-disable-line
  // console.log(server); // eslint-disable-line
});
