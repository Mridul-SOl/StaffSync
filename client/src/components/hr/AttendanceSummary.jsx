import React, { useState, useEffect } from 'react';

const AttendanceSummary = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await fetch('/api/attendance', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setRecords(data);
        }
      } catch (err) {
        console.error('Error fetching attendance summary:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [token]);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US');
  };

  return (
    <div className="content-card">
      <h3 className="card-title" style={{ marginBottom: '18px' }}>
        Attendance Records
      </h3>

      {loading ? (
        <p style={{ color: '#94a3b8' }}>Loading attendance...</p>
      ) : (
        <div className="hrm-table-wrapper">
          <table className="hrm-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', color: '#94a3b8' }}>
                    No attendance records found.
                  </td>
                </tr>
              ) : (
                records.map((rec) => (
                  <tr key={rec._id}>
                    <td>{rec.user?.name || 'Unknown'}</td>
                    <td>{formatDate(rec.date)}</td>
                    <td>{rec.checkInTime || '--:--'}</td>
                    <td>{rec.checkOutTime || '--:--'}</td>
                    <td>
                      <span className="badge-present">{rec.status}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AttendanceSummary;
