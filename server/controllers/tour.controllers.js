const fs = require("fs");
const Tour = require("../models/tour.model");

const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data.json`));

/**
 * @middleware
 * Validates tour id
 */
exports.validateId = (req, res, next) => {
  if (req.params.id * 1 > tours.length) {
    res.status(400).json({
      status: "fail",
      message: "Invalid ID",
    });
  }
  next();
};

exports.createTour = (req, res) => {};

exports.getTour = (req, res) => {};
/**
 * Gets all tours
 * @param {*} req
 * @param {*} res
 */
exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours,
    },
  });
};

exports.updateTour = (req, res) => {};
exports.deleteTour = (req, res) => {};
