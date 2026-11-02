const Training = require("../models/Training");

// @desc    Create a new training program
// @route   POST /api/trainings
// @access  Private (Manager)
const createTraining = async (req, res) => {
  try {
    const { title, description, date, trainer, assignedTo } = req.body;

    if (!title || !description || !date) {
      return res.status(400).json({ message: "Title, description, and date are required" });
    }

    let assignedArray = [];
    if (assignedTo) {
      if (Array.isArray(assignedTo)) {
        assignedArray = assignedTo;
      } else if (typeof assignedTo === "string" && assignedTo.trim() !== "" && assignedTo !== "N/A") {
        assignedArray = [assignedTo];
      }
    }

    const training = await Training.create({
      title,
      description,
      date: new Date(date),
      trainer: trainer || "TBD",
      createdBy: req.user._id,
      assignedTo: assignedArray,
    });

    const populated = await Training.findById(training._id)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name role");

    res.status(201).json(populated);
  } catch (error) {
    console.error("Create training error:", error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

// @desc    Get all trainings
// @route   GET /api/trainings
// @access  Private
const getTrainings = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === "Employee") {
      // Employee sees trainings assigned to them OR open trainings where assignedTo is empty
      filter = {
        $or: [
          { assignedTo: req.user._id },
          { assignedTo: { $size: 0 } },
          { assignedTo: { $exists: false } },
        ],
      };
    }

    const trainings = await Training.find(filter)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name role")
      .sort({ date: 1, createdAt: -1 });

    res.json(trainings);
  } catch (error) {
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

// @desc    Update a training program
// @route   PUT /api/trainings/:id
// @access  Private (Manager)
const updateTraining = async (req, res) => {
  try {
    const { title, description, date, trainer, assignedTo } = req.body;

    const training = await Training.findById(req.params.id);
    if (!training) {
      return res.status(404).json({ message: "Training program not found" });
    }

    training.title = title || training.title;
    training.description = description || training.description;
    if (date) training.date = new Date(date);
    if (trainer !== undefined) training.trainer = trainer;
    if (assignedTo !== undefined) {
      training.assignedTo = Array.isArray(assignedTo) ? assignedTo : [assignedTo];
    }

    const updated = await training.save();
    const populated = await Training.findById(updated._id)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name role");

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

// @desc    Delete a training program
// @route   DELETE /api/trainings/:id
// @access  Private (Manager)
const deleteTraining = async (req, res) => {
  try {
    const training = await Training.findById(req.params.id);
    if (!training) {
      return res.status(404).json({ message: "Training program not found" });
    }

    await Training.findByIdAndDelete(req.params.id);
    res.json({ message: "Training program deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

module.exports = {
  createTraining,
  getTrainings,
  updateTraining,
  deleteTraining,
};

