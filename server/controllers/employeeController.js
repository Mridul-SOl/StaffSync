const Employee = require("../models/Employee");
const User = require("../models/User");

// @desc    Get all employees
// @route   GET /api/employees
// @access  Private (HR, Manager)
const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({}).sort({ createdAt: -1 });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

// @desc    Get employee by ID
// @route   GET /api/employees/:id
// @access  Private
const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

// @desc    Create new employee
// @route   POST /api/employees
// @access  Private (HR)
const createEmployee = async (req, res) => {
  try {
    const { name, email, department, position, salary, joinDate, phone, address } = req.body;

    if (!name || !email || !department || !position || !salary || !joinDate) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res.status(400).json({ message: "Employee with this email already exists" });
    }

    // Check or create corresponding User account
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name,
        email,
        password: "Password@123", // Default password for new employees created by HR
        role: "Employee",
        department,
      });
    }

    const employee = await Employee.create({
      user: user._id,
      name,
      email,
      department,
      position,
      salary: Number(salary),
      joinDate: new Date(joinDate),
      phone: phone || "",
      address: address || "",
    });

    res.status(201).json(employee);
  } catch (error) {
    console.error("Create Employee error:", error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Private (HR)
const updateEmployee = async (req, res) => {
  try {
    const { name, email, department, position, salary, joinDate, phone, address } = req.body;

    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    employee.name = name || employee.name;
    employee.email = email || employee.email;
    employee.department = department || employee.department;
    employee.position = position || employee.position;
    if (salary !== undefined) employee.salary = Number(salary);
    if (joinDate) employee.joinDate = new Date(joinDate);
    if (phone !== undefined) employee.phone = phone;
    if (address !== undefined) employee.address = address;

    const updatedEmployee = await employee.save();

    // Also update associated user name/department if changed
    if (employee.user) {
      await User.findByIdAndUpdate(employee.user, {
        name: employee.name,
        department: employee.department,
      });
    }

    res.json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

// @desc    Delete employee
// @route   DELETE /api/employees/:id
// @access  Private (HR)
const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    await Employee.findByIdAndDelete(req.params.id);
    res.json({ message: "Employee removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

module.exports = {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};

