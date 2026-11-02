import React, { useState, useEffect } from 'react';

const Attendance = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const token = localStorage.getItem('token');

  const fetchAttendance = async () => {
    try {
      const res = await fetch('/api/attendance/my', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setRecords(data);
      }
    } catch (err) {
      console.error('Attendance fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [token]);

  const handleClockToggle = async () => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/attendance/mark', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        await fetchAttendance();
      }
    } catch (err) {
      console.error('Error clocking in/out:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  // Determine current day's status for the action pill button
  const todayRecord = records.find(
    (r) => new Date(r.date).toDateString() === new Date().toDateString()
  );

  let buttonText = 'Check In';
  let buttonStyle = { backgroundColor: '#10b981', color: '#ffffff' };

  if (todayRecord) {
    if (todayRecord.checkOutTime) {
      buttonText = 'Checked Out';
      buttonStyle = { backgroundColor: '#064e3b', color: '#6ee7b7' };
    } else {
      buttonText = 'Check Out';
      buttonStyle = { backgroundColor: '#f59e0b', color: '#000000' };
    }
  }

  return (
    <div className="content-card">
      <div className="card-header-row">
        <h3 className="card-title">Attendance</h3>
        <button
          className="btn-primary-blue"
          style={{ ...buttonStyle, border: 'none', padding: '6px 18px', borderRadius: '18px', fontSize: '13px' }}
          onClick={handleClockToggle}
          disabled={actionLoading}
        >
          {actionLoading ? 'Updating...' : buttonText}
        </button>
      </div>

      {loading ? (
        <p style={{ color: '#94a3b8' }}>Loading attendance records...</p>
      ) : records.length === 0 ? (
        <p style={{ color: '#94a3b8' }}>No attendance logged yet. Click Check In to log today.</p>
      ) : (
        records.map((rec) => (
          <div key={rec._id} className="list-item-card">
            <div>
              <div className="item-main-title">{formatDate(rec.date)}</div>
              <div className="item-subtext">
                In: {rec.checkInTime || '--:--'} | Out: {rec.checkOutTime || '--:--'}
              </div>
            </div>
            <div>
              <span className="badge-present">{rec.status}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Attendance;
