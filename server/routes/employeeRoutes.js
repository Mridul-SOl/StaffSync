const express = require("express");
const router = express.Router();
const {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employeeController");
const { protect, authorize } = require("../middleware/authMiddleware");

router
  .route("/")
  .get(protect, getEmployees)
  .post(protect, authorize("HR"), createEmployee);

router
  .route("/:id")
  .get(protect, getEmployeeById)
  .put(protect, authorize("HR"), updateEmployee)
  .delete(protect, authorize("HR"), deleteEmployee);

module.exports = router;

