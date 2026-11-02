import React from 'react';

const LeaveList = ({ leaves, loading }) => {
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusBadge = (status) => {
    if (status === 'Approved') return <span className="badge-approved">Approved</span>;
    if (status === 'Rejected') return <span className="badge-rejected">Rejected</span>;
    return <span className="badge-pending">Pending</span>;
  };

  return (
    <div className="content-card">
      <h3 className="card-title" style={{ marginBottom: '18px' }}>
        My Leaves
      </h3>

      {loading ? (
        <p style={{ color: '#94a3b8' }}>Loading leave records...</p>
      ) : leaves.length === 0 ? (
        <p style={{ color: '#94a3b8' }}>No leave applications submitted yet.</p>
      ) : (
        leaves.map((leave) => (
          <div key={leave._id} className="list-item-card">
            <div>
              <div className="item-main-title">
                {formatDate(leave.startDate)} → {formatDate(leave.endDate)}
              </div>
              <div className="item-subtext">{leave.reason}</div>
            </div>
            <div>{getStatusBadge(leave.status)}</div>
          </div>
        ))
      )}
    </div>
  );
};

export default LeaveList;
