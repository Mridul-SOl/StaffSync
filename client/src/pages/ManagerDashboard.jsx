import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LeaveApplications from '../components/manager/LeaveApplications';
import TrainingManagement from '../components/manager/TrainingManagement';

const ManagerDashboard = () => {
  const [activeTab, setActiveTab] = useState('leaves');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="hrm-container">
      {/* Header */}
      <header className="hrm-navbar">
        <div className="portal-title">Manager Dashboard</div>
        <button className="btn-logout" onClick={handleLogout}>
          Logout
        </button>
      </header>

      {/* Main Container */}
      <main className="dashboard-container">
        <h2 className="dashboard-greeting">Welcome Back, Manager</h2>

        {/* Pill Switcher */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '28px' }}>
          <div className="pill-switcher">
            <button
              className={`pill-btn ${activeTab === 'leaves' ? 'active-blue' : ''}`}
              onClick={() => setActiveTab('leaves')}
            >
              Leave Applications
            </button>
            <button
              className={`pill-btn ${activeTab === 'training' ? 'active-green' : ''}`}
              onClick={() => setActiveTab('training')}
            >
              Training & Development
            </button>
          </div>
        </div>

        {/* Dynamic Views */}
        {activeTab === 'leaves' && <LeaveApplications />}
        {activeTab === 'training' && <TrainingManagement />}
      </main>
    </div>
  );
};

export default ManagerDashboard;
