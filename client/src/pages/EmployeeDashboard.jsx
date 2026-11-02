import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Announcements from '../components/employee/Announcements';
import LeaveApply from '../components/employee/LeaveApply';
import LeaveList from '../components/employee/LeaveList';
import Attendance from '../components/employee/Attendance';

const EmployeeDashboard = () => {
  const [activeTab, setActiveTab] = useState('announcements');
  const [leaves, setLeaves] = useState([]);
  const [leavesLoading, setLeavesLoading] = useState(false);
  const [user, setUser] = useState({});

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (e) {}
    }
  }, []);

  const fetchLeaves = async () => {
    setLeavesLoading(true);
    try {
      const res = await fetch('/api/leaves/my-leaves', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setLeaves(data);
      }
    } catch (err) {
      console.error('Error fetching leaves:', err);
    } finally {
      setLeavesLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'leaves') {
      fetchLeaves();
    }
  }, [activeTab]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="hrm-container">
      {/* Header */}
      <header className="hrm-navbar">
        <div className="portal-title">Employee Portal</div>
        <button className="btn-logout" onClick={handleLogout}>
          Logout
        </button>
      </header>

      {/* Main Content */}
      <main className="dashboard-container">
        {/* Navigation Tabs */}
        <nav className="tabs-nav">
          <button
            className={`tab-btn ${activeTab === 'announcements' ? 'active' : ''}`}
            onClick={() => setActiveTab('announcements')}
          >
            Announcements
          </button>
          <button
            className={`tab-btn ${activeTab === 'leaves' ? 'active' : ''}`}
            onClick={() => setActiveTab('leaves')}
          >
            Leaves
          </button>
          <button
            className={`tab-btn ${activeTab === 'attendance' ? 'active' : ''}`}
            onClick={() => setActiveTab('attendance')}
          >
            Attendance
          </button>
          <button
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
        </nav>

        {/* Tab Content */}
        {activeTab === 'announcements' && <Announcements />}

        {activeTab === 'leaves' && (
          <div>
            <LeaveApply onLeaveApplied={fetchLeaves} />
            <LeaveList leaves={leaves} loading={leavesLoading} />
          </div>
        )}

        {activeTab === 'attendance' && <Attendance />}

        {activeTab === 'profile' && (
          <div className="content-card">
            <h3 className="card-title" style={{ marginBottom: '20px' }}>
              My Profile
            </h3>
            <div style={{ lineHeight: '2.2', fontSize: '15px', color: '#cbd5e1' }}>
              <div><strong>Name:</strong> {user.name || 'John Doe'}</div>
              <div><strong>Email:</strong> {user.email || 'johndoe@email.com'}</div>
              <div><strong>Role:</strong> {user.role || 'Employee'}</div>
              {user.department && <div><strong>Department:</strong> {user.department}</div>}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default EmployeeDashboard;
