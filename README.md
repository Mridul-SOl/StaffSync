# StaffSync – Modern Human Resource Management Solution

StaffSync is a comprehensive web-based Human Resource Management (HRM) system built using the **MERN Stack** (MongoDB, Express.js, React.js, and Node.js). It streamlines and automates core HR processes within an organization with role-based access control for **HR Personnel**, **Managers**, and **Employees**.

---

## 🌟 Key Features by Role

### 1. 👔 HR Personnel
- **Employee Records Management**: Full CRUD operations (Add, View, Edit, Delete employee data including personal details, department, salary, and join date).
- **Leave Request Management**: Review, approve, or reject leave applications submitted across the organization with real-time status updates.
- **Attendance Monitoring**: Organization-wide attendance tracking with daily check-in/check-out timestamps and status.
- **Company Announcements**: Create, broadcast, and manage announcements targeted to all employees or specific roles.

### 2. 👥 Managers
- **Leave Approvals**: Review and act on leave applications submitted by team members with recorded approver designations.
- **Training & Development**: Create, schedule, and assign training programs/modules to employees with trainer details and dates.
- **Team Announcements**: View company-wide announcements and notifications.

### 3. 👤 Employees
- **Self-Service Portal**: View personal employment profile and role information.
- **Digital Leave Applications**: Apply for leaves with custom date ranges and reasons; track leave history and approval statuses.
- **Attendance Tracking**: Clock in and clock out daily with status verification.
- **Company News & Training**: Stay updated with company announcements and assigned training programs.

---

## 🛠️ Technology Stack

- **Frontend**:
  - React.js (Vite)
  - React Router DOM v6
  - Bootstrap & Custom CSS (Dark Theme UI)
  - Lucide React Icons
- **Backend**:
  - Node.js & Express.js
  - MVC (Model-View-Controller) Architecture
  - JWT (JSON Web Tokens) Authentication
  - Bcrypt.js (Password Hashing)
  - CORS & Dotenv
- **Database**:
  - MongoDB
  - Mongoose (Object Data Modeling)

---

## 📁 Project Structure

```text
StaffSync/
├── client/                     # Frontend React Application (Vite)
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/          # Login & Register forms
│   │   │   ├── employee/      # Employee Portal views (Leaves, Attendance, Announcements)
│   │   │   ├── hr/            # HR Portal views (Employee CRUD, Leaves, Attendance, Announcements)
│   │   │   ├── manager/       # Manager Portal views (Leaves, Training & Development)
│   │   │   └── Home.jsx       # Landing page with hero banner & feature cards
│   │   ├── pages/             # Role-based dashboard wrappers
│   │   │   ├── EmployeeDashboard.jsx
│   │   │   ├── HrDashboard.jsx
│   │   │   └── ManagerDashboard.jsx
│   │   ├── routes/            # ProtectedRoute with RBAC guards
│   │   ├── App.jsx            # Central router configuration
│   │   ├── App.css            # Dark theme styles & responsive layouts
│   │   └── main.jsx           # App entry point
│   ├── vite.config.js         # Vite configuration with API proxy to port 8000
│   └── package.json
│
├── server/                     # Backend REST API Server (Node.js & Express)
│   ├── config/
│   │   └── db.js              # MongoDB Mongoose connection
│   ├── controllers/           # Modular business logic controllers
│   │   ├── announcementController.js
│   │   ├── attendanceController.js
│   │   ├── authController.js
│   │   ├── employeeController.js
│   │   ├── leaveController.js
│   │   └── trainingController.js
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT validation & role authorization middleware
│   ├── models/                # Mongoose database schemas
│   │   ├── Announcement.js
│   │   ├── Attendance.js
│   │   ├── Employee.js
│   │   ├── Leave.js
│   │   ├── Training.js
│   │   └── User.js
│   ├── routes/                # Express API endpoints
│   ├── seed.js                # Database seeder with sample data
│   ├── server.js              # Application entry point
│   ├── .env.example           # Environment variables template
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## ⚙️ Prerequisites

Before running the application, make sure you have installed:
- **Node.js**: v16+ (Node 18+ or 20+ recommended)
- **npm**: v8+
- **MongoDB**: Installed locally (or a MongoDB Atlas connection URI)

---

## 🚀 Step-by-Step Setup and Execution Guide

### 1. Clone or Open the Repository
```bash
git clone <your-repo-url>
cd StaffSync
```

### 2. Start MongoDB
Ensure MongoDB is running locally on port `27017`:
```bash
# On macOS (Homebrew):
brew services start mongodb-community
# Or directly via mongod:
mongod --dbpath ./data/db
```

### 3. Set Up the Backend Server
1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install server dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   Create a `.env` file inside the `server/` directory:
   ```env
   PORT=8000
   MONGO_URI=mongodb://127.0.0.1:27017/hrm
   JWT_SECRET=staffsync_super_secret_jwt_key_2025_hrm
   ```
4. *(Optional but Recommended)* Seed initial demo data:
   ```bash
   node seed.js
   ```
5. Start the backend server:
   ```bash
   npm start
   # Or with nodemon for auto-reload:
   npm run dev
   ```
   *The backend will start on **`http://localhost:8000`**.*

### 4. Set Up the Frontend Client
1. Open a new terminal and navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install client dependencies:
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm run dev
   ```
   *The application will be live at **`http://localhost:5173`**.*

---

## 🔑 Demo Credentials

The database seeder (`node seed.js`) automatically provisions test accounts for each role:

| Role | Email | Password | Pre-loaded Features |
| :--- | :--- | :--- | :--- |
| **HR Personnel** | `hr@hrm.com` | `password123` | Employee CRUD, Leave Approvals, Attendance Summary, Post Announcements |
| **Manager** | `manager@hrm.com` | `password123` | Team Leave Approvals, Training & Development Management |
| **Employee (John)** | `johndoe@email.com` | `password123` | Daily Attendance, Apply Leaves, View Announcements & Training |
| **Employee (Pravanshu)** | `pravanshu@gmail.com` | `password123` | Attendance Logs, Leave Records, Profile |

*(You can also click **Register** on the navigation bar to create brand new accounts for any role).*

---

## 📡 REST API Endpoints Overview

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Register a new user | Public |
| **POST** | `/api/auth/login` | Authenticate & retrieve JWT token | Public |
| **GET** | `/api/auth/me` | Fetch logged-in user profile | Private |
| **GET** | `/api/employees` | List all employee records | Private (HR, Manager) |
| **POST** | `/api/employees` | Create employee record | Private (HR) |
| **PUT** | `/api/employees/:id` | Update employee record | Private (HR) |
| **DELETE** | `/api/employees/:id` | Remove employee record | Private (HR) |
| **POST** | `/api/leaves` | Submit a leave request | Private (Employee) |
| **GET** | `/api/leaves` | List all leave requests | Private (HR, Manager) |
| **GET** | `/api/leaves/my-leaves` | List current employee's leaves | Private (Employee) |
| **PUT** | `/api/leaves/:id/status`| Approve or reject leave request | Private (HR, Manager) |
| **POST** | `/api/attendance/mark` | Check in / Check out toggle | Private (Employee) |
| **GET** | `/api/attendance/my` | View personal attendance history | Private (Employee) |
| **GET** | `/api/attendance` | View all attendance records | Private (HR, Manager) |
| **GET** | `/api/announcements` | Retrieve announcements by audience | Private |
| **POST** | `/api/announcements` | Publish new announcement | Private (HR, Manager) |
| **DELETE**| `/api/announcements/:id`| Remove announcement | Private (HR) |
| **GET** | `/api/trainings` | List training programs | Private |
| **POST** | `/api/trainings` | Create training program | Private (Manager) |
| **PUT** | `/api/trainings/:id` | Update training program | Private (Manager) |
| **DELETE**| `/api/trainings/:id` | Delete training program | Private (Manager) |

---

## 📄 License
This project is developed for educational and organizational human resource management purposes.

