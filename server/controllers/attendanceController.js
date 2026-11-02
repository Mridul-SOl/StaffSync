const Attendance = require("../models/Attendance");

// Helper to get normalized date (midnight)
const getNormalizedDate = (d = new Date()) => {
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  return date;
};

// @desc    Check-in / Check-out toggle
// @route   POST /api/attendance/mark
// @access  Private (Employee)
const markAttendance = async (req, res) => {
  try {
    const today = getNormalizedDate();
    const currentTime = new Date().toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

    let record = await Attendance.findOne({
      user: req.user._id,
      date: today,
    });

    if (!record) {
      // First check-in of the day
      record = await Attendance.create({
        user: req.user._id,
        date: today,
        checkInTime: currentTime,
        status: "Present",
      });
      return res.status(201).json({ message: "Checked In successfully", record });
    } else if (!record.checkOutTime) {
      // Check-out for today
      record.checkOutTime = currentTime;
      await record.save();
      return res.json({ message: "Checked Out successfully", record });
    } else {
      // Already checked out, update checkout time or record
      record.checkOutTime = currentTime;
      await record.save();
      return res.json({ message: "Check-out time updated", record });
    }
  } catch (error) {
    console.error("Attendance mark error:", error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

// @desc    Get logged in user's attendance
// @route   GET /api/attendance/my
// @access  Private (Employee)
const getMyAttendance = async (req, res) => {
  try {
    const records = await Attendance.find({ user: req.user._id }).sort({ date: -1, createdAt: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

// @desc    Get all employees attendance records
// @route   GET /api/attendance
// @access  Private (HR, Manager)
const getAllAttendance = async (req, res) => {
  try {
    const records = await Attendance.find({})
      .populate("user", "name email department")
      .sort({ date: -1, createdAt: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

module.exports = {
  markAttendance,
  getMyAttendance,
  getAllAttendance,
};

