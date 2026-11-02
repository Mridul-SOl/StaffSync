import React, { useState, useEffect } from 'react';

const LeaveApplications = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  const fetchLeaves = async () => {
    try {
      const res = await fetch('/api/leaves', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setLeaves(data);
      }
    } catch (err) {
      console.error('Error fetching all leaves:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [token]);

  const handleStatusChange = async (id, status) => {
    try {
      const res = await fetch(`/api/leaves/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        await fetchLeaves();
      }
    } catch (err) {
      console.error('Error updating leave status:', err);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US');
  };

  return (
    <div className="content-card">
      <h3 className="card-title" style={{ marginBottom: '16px' }}>
        Leave Applications
      </h3>

      {loading ? (
        <p style={{ color: '#94a3b8' }}>Loading applications...</p>
      ) : (
        <div className="hrm-table-wrapper">
          <table className="hrm-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Email</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaves.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', color: '#94a3b8' }}>
                    No leave applications found.
                  </td>
                </tr>
              ) : (
                leaves.map((leave) => (
                  <tr key={leave._id}>
                    <td>{leave.user?.name || 'Unknown'}</td>
                    <td>{leave.user?.email || 'N/A'}</td>
                    <td>{formatDate(leave.startDate)}</td>
                    <td>{formatDate(leave.endDate)}</td>
                    <td>{leave.reason}</td>
                    <td>
                      <span
                        style={{
                          fontWeight: '600',
                          color:
                            leave.status === 'Approved'
                              ? '#4ade80'
                              : leave.status === 'Rejected'
                              ? '#f87171'
                              : '#facc15',
                        }}
                      >
                        {leave.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn-action-approve"
                        onClick={() => handleStatusChange(leave._id, 'Approved')}
                      >
                        Approve
                      </button>
                      <button
                        className="btn-action-reject"
                        onClick={() => handleStatusChange(leave._id, 'Rejected')}
                      >
                        Reject
                      </button>
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

export default LeaveApplications;
