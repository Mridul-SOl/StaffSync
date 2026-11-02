const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Employee = require('./models/Employee');
const Leave = require('./models/Leave');
const Attendance = require('./models/Attendance');
const Announcement = require('./models/Announcement');
const Training = require('./models/Training');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hrm');
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Employee.deleteMany({}),
      Leave.deleteMany({}),
      Attendance.deleteMany({}),
      Announcement.deleteMany({}),
      Training.deleteMany({}),
    ]);

    // Create Users
    const hrUser = await User.create({
      name: 'HR Admin',
      email: 'hr@hrm.com',
      password: 'password123',
      role: 'HR',
      department: 'Human Resources',
    });

    const managerUser = await User.create({
      name: 'Adnan Saif (Manager)',
      email: 'manager@hrm.com',
      password: 'password123',
      role: 'Manager',
      department: 'Engineering',
    });

    const empUser1 = await User.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: 'password123',
      role: 'Employee',
      department: 'AI/ML',
    });

    const empUser2 = await User.create({
      name: 'Pravanshu Samadhiya',
      email: 'pravanshu@gmail.com',
      password: 'password123',
      role: 'Employee',
      department: 'Engineering',
    });

    // Create Employees
    await Employee.create([
      {
        user: empUser1._id,
        name: 'John Doe',
        email: 'johndoe@email.com',
        department: 'AI/ML',
        position: 'Software Developer',
        salary: 45000,
        joinDate: new Date('2024-01-15'),
        phone: '9876543210',
        address: 'Downtown Avenue 12',
      },
      {
        user: empUser2._id,
        name: 'Pravanshu Samadhiya',
        email: 'pravanshu@gmail.com',
        department: 'AI/ML',
        position: 'Intern',
        salary: 10000,
        joinDate: new Date('2025-08-14'),
        phone: '3949323423',
        address: 'Botanical Garden',
      },
    ]);

    // Create Announcements
    await Announcement.create([
      {
        title: 'Annual Company Meetup 2025',
        message: 'The annual general meeting and hackathon will be scheduled next week in main hall.',
        createdBy: hrUser._id,
        targetAudience: 'All',
      },
      {
        title: 'New Health Insurance Policy',
        message: 'Please review and submit updated dependent details before Friday.',
        createdBy: hrUser._id,
        targetAudience: 'Employees',
      },
    ]);

    // Create Training
    await Training.create({
      title: 'MongoDB CRUD',
      description: 'This Training Session is based on the MongoDB CRUD Operation.',
      date: new Date('2025-11-05'),
      trainer: 'Adnan Saif',
      createdBy: managerUser._id,
      assignedTo: [empUser1._id, empUser2._id],
    });

    // Create Leaves
    await Leave.create([
      {
        user: empUser2._id,
        startDate: new Date('2025-11-05'),
        endDate: new Date('2025-11-06'),
        reason: 'I have to go for Office Meeting',
        status: 'Approved',
        approverRole: 'HR',
      },
      {
        user: empUser2._id,
        startDate: new Date('2025-11-10'),
        endDate: new Date('2025-11-12'),
        reason: 'Family function at hometown',
        status: 'Rejected',
        approverRole: 'HR',
      },
      {
        user: empUser1._id,
        startDate: new Date('2025-11-20'),
        endDate: new Date('2025-11-22'),
        reason: 'Personal medical checkup',
        status: 'Pending',
      },
    ]);

    // Create Attendance
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(Date.now() - 86400000);
    yesterday.setHours(0, 0, 0, 0);

    await Attendance.create([
      {
        user: empUser2._id,
        date: yesterday,
        checkInTime: '9:24:19 AM',
        checkOutTime: '10:07:23 AM',
        status: 'Present',
      },
      {
        user: empUser2._id,
        date: today,
        checkInTime: '3:47:43 PM',
        checkOutTime: '3:47:54 PM',
        status: 'Present',
      },
      {
        user: empUser1._id,
        date: today,
        checkInTime: '9:15:00 AM',
        checkOutTime: '5:30:00 PM',
        status: 'Present',
      },
    ]);

    console.log('Database seeded successfully with demo users, leaves, attendance, and training!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedData();

