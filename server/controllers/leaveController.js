const Leave = require("../models/Leave");

// @desc    Apply for a leave
// @route   POST /api/leaves
// @access  Private (Employee)
const applyLeave = async (req, res) => {
  try {
    const { startDate, endDate, reason } = req.body;

    if (!startDate || !endDate || !reason) {
      return res.status(400).json({ message: "Please provide start date, end date, and reason" });
    }

    const leave = await Leave.create({
      user: req.user._id,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      reason,
      status: "Pending",
    });

    res.status(201).json(leave);
  } catch (error) {
    console.error("Apply leave error:", error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

// @desc    Get all leave requests
// @route   GET /api/leaves
// @access  Private (HR, Manager)
const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({})
      .populate("user", "name email department")
      .sort({ createdAt: -1 });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

// @desc    Get logged in user's leave requests
// @route   GET /api/leaves/my-leaves
// @access  Private (Employee)
const getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

// @desc    Update leave status (Approve / Reject)
// @route   PUT /api/leaves/:id/status
// @access  Private (HR, Manager)
const updateLeaveStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !["Approved", "Rejected", "Pending"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const leave = await Leave.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    leave.status = status;
    leave.approverRole = req.user.role; // Track who approved/rejected: HR or Manager

    const updatedLeave = await leave.save();
    const populated = await Leave.findById(updatedLeave._id).populate("user", "name email department");
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

module.exports = {
  applyLeave,
  getAllLeaves,
  getMyLeaves,
  updateLeaveStatus,
};

