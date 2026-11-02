const Announcement = require("../models/Announcement");

// @desc    Create an announcement
// @route   POST /api/announcements
// @access  Private (HR, Manager)
const createAnnouncement = async (req, res) => {
  try {
    const { title, message, targetAudience } = req.body;

    if (!title || !message) {
      return res.status(400).json({ message: "Title and Message are required" });
    }

    const announcement = await Announcement.create({
      title,
      message,
      targetAudience: targetAudience || "All",
      createdBy: req.user._id,
    });

    const populated = await Announcement.findById(announcement._id).populate("createdBy", "name role");
    res.status(201).json(populated);
  } catch (error) {
    console.error("Create announcement error:", error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

// @desc    Get all announcements (filtered for user role or all for HR)
// @route   GET /api/announcements
// @access  Private
const getAnnouncements = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === "Employee") {
      filter = { targetAudience: { $in: ["All", "Employees"] } };
    } else if (req.user.role === "Manager") {
      filter = { targetAudience: { $in: ["All", "Managers"] } };
    }
    // HR can see all

    const announcements = await Announcement.find(filter)
      .populate("createdBy", "name role")
      .sort({ createdAt: -1 });

    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

// @desc    Delete an announcement
// @route   DELETE /api/announcements/:id
// @access  Private (HR)
const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ message: "Announcement deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

module.exports = {
  createAnnouncement,
  getAnnouncements,
  deleteAnnouncement,
};

