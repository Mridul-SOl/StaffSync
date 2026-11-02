const express = require("express");
const router = express.Router();
const {
  createTraining,
  getTrainings,
  updateTraining,
  deleteTraining,
} = require("../controllers/trainingController");
const { protect, authorize } = require("../middleware/authMiddleware");

router
  .route("/")
  .get(protect, getTrainings)
  .post(protect, authorize("Manager"), createTraining);

router
  .route("/:id")
  .put(protect, authorize("Manager"), updateTraining)
  .delete(protect, authorize("Manager"), deleteTraining);

module.exports = router;

