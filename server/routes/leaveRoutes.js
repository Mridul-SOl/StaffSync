const express = require("express");
const router = express.Router();
const {
  applyLeave,
  getAllLeaves,
  getMyLeaves,
  updateLeaveStatus,
} = require("../controllers/leaveController");
const { protect, authorize } = require("../middleware/authMiddleware");

router
  .route("/")
  .post(protect, applyLeave)
  .get(protect, authorize("HR", "Manager"), getAllLeaves);

router.get("/my-leaves", protect, getMyLeaves);

router.put("/:id/status", protect, authorize("HR", "Manager"), updateLeaveStatus);

module.exports = router;

