const express = require("express");
const {
  createTour,
  getAllTours,
  getTour,
  updateTour,
  deleteTour,
  validateId,
} = require("../controllers/tour.controller");

const router = express.Router();

// router.param("id", validateId);

router.route("/").get(getAllTours);
//   .post(createTour)
//   .put(updateTour)
//   .delete(deleteTour);

// router.route("/:id").get(getTour).put(updateTour).delete(deleteTour);

module.exports = router;
