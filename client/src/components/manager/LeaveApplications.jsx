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
      console.error('Error fetching manager leaves:', err);
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
      console.error('Error updating status:', err);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US');
  };

  return (
    <div>
      <h3 className="card-title" style={{ marginBottom: '20px' }}>
        Leave Applications
      </h3>

      {loading ? (
        <p style={{ color: '#94a3b8' }}>Loading leave requests...</p>
      ) : leaves.length === 0 ? (
        <p style={{ color: '#94a3b8' }}>No leave applications to display.</p>
      ) : (
        <div className="cards-grid">
          {leaves.map((leave) => (
            <div
              key={leave._id}
              className="training-program-card"
              style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            >
              <div style={{ lineHeight: '1.8', fontSize: '14px', color: '#cbd5e1' }}>
                <div>
                  <strong style={{ color: '#ffffff' }}>Employee:</strong>{' '}
                  {leave.user?.name || 'Unknown'} ({leave.user?.email || 'N/A'})
                </div>
                <div>
                  <strong style={{ color: '#ffffff' }}>From:</strong> {formatDate(leave.startDate)}
                </div>
                <div>
                  <strong style={{ color: '#ffffff' }}>To:</strong> {formatDate(leave.endDate)}
                </div>
                <div>
                  <strong style={{ color: '#ffffff' }}>Reason:</strong> {leave.reason}
                </div>
                <div>
                  <strong style={{ color: '#ffffff' }}>Status:</strong>{' '}
                  <span
                    style={{
                      fontWeight: '700',
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
                </div>
                <div>
                  <strong style={{ color: '#ffffff' }}>Approved/Rejected By:</strong>{' '}
                  <span style={{ color: '#38bdf8' }}>{leave.approverRole || 'Pending'}</span>
                </div>
              </div>

              {leave.status === 'Pending' && (
                <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
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
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LeaveApplications;
