const express = require("express");
const router = express.Router();
const {
  createAnnouncement,
  getAnnouncements,
  deleteAnnouncement,
} = require("../controllers/announcementController");
const { protect, authorize } = require("../middleware/authMiddleware");

router
  .route("/")
  .get(protect, getAnnouncements)
  .post(protect, authorize("HR", "Manager"), createAnnouncement);

router.delete("/:id", protect, authorize("HR"), deleteAnnouncement);

module.exports = router;

