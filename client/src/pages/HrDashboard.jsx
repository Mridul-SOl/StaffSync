import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LeaveApplications from '../components/hr/LeaveApplications';
import EmployeeCRUD from '../components/hr/EmployeeCRUD';
import AnnouncementsManager from '../components/hr/AnnouncementsManager';
import AttendanceSummary from '../components/hr/AttendanceSummary';

const HrDashboard = () => {
  const [activeTab, setActiveTab] = useState('leaves');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="hrm-container">
      {/* Navbar */}
      <header className="hrm-navbar">
        <div className="portal-title">HR Portal</div>
        <button className="btn-logout" onClick={handleLogout}>
          Logout
        </button>
      </header>

      {/* Main Container */}
      <main className="dashboard-container">
        <h2 className="dashboard-heading">HR Dashboard</h2>

        {/* Navigation Tabs */}
        <nav className="tabs-nav">
          <button
            className={`tab-btn ${activeTab === 'leaves' ? 'active' : ''}`}
            onClick={() => setActiveTab('leaves')}
          >
            Leave Applications
          </button>
          <button
            className={`tab-btn ${activeTab === 'employees' ? 'active' : ''}`}
            onClick={() => setActiveTab('employees')}
          >
            Employee Management
          </button>
          <button
            className={`tab-btn ${activeTab === 'announcements' ? 'active' : ''}`}
            onClick={() => setActiveTab('announcements')}
          >
            Announcements
          </button>
          <button
            className={`tab-btn ${activeTab === 'attendance' ? 'active' : ''}`}
            onClick={() => setActiveTab('attendance')}
          >
            Attendance
          </button>
        </nav>

        {/* Dynamic Views */}
        {activeTab === 'leaves' && <LeaveApplications />}
        {activeTab === 'employees' && <EmployeeCRUD />}
        {activeTab === 'announcements' && <AnnouncementsManager />}
        {activeTab === 'attendance' && <AttendanceSummary />}
      </main>
    </div>
  );
};

export default HrDashboard;
