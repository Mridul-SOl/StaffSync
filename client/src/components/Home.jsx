import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Calendar, Briefcase, Award } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="hrm-container">
      {/* Navbar */}
      <header className="hrm-navbar">
        <div className="hrm-logo">HRM Portal</div>
        <button
          className="btn-primary-blue"
          onClick={() => navigate('/login')}
        >
          Login / Register
        </button>
      </header>

      {/* Hero Section */}
      <main>
        <section className="hero-section">
          <h1 className="hero-title">
            Empower Your Workforce with <span className="hero-highlight">HRM Portal</span>
          </h1>
          <p className="hero-subtitle">
            A smart Human Resource Management platform designed to simplify attendance tracking,
            leave management, employee records, and communication across teams.
          </p>
          <button
            className="btn-primary-blue"
            style={{ padding: '12px 28px', fontSize: '15px' }}
            onClick={() => navigate('/login')}
          >
            Get Started
          </button>
        </section>

        {/* Features 4-Card Grid */}
        <section className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <Users size={32} color="#3b82f6" />
            </div>
            <h3 className="feature-card-title">Employee Management</h3>
            <p className="feature-card-desc">
              Manage employee records, roles, and information efficiently.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <Calendar size={32} color="#10b981" />
            </div>
            <h3 className="feature-card-title">Attendance & Leave</h3>
            <p className="feature-card-desc">
              Track attendance and handle leave approvals easily.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <Briefcase size={32} color="#f59e0b" />
            </div>
            <h3 className="feature-card-title">HR & Manager Tools</h3>
            <p className="feature-card-desc">
              Handle team announcements, performance, and training modules.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <Award size={32} color="#ec4899" />
            </div>
            <h3 className="feature-card-title">Employee Growth</h3>
            <p className="feature-card-desc">
              Monitor performance and assign development trainings.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="hrm-footer">
        © 2025 HRM Portal — Empowering Teams, Simplifying Workflows.
      </footer>
    </div>
  );
};

export default Home;

