import React, { useState } from 'react';

const LeaveApply = ({ onLeaveApplied }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/leaves', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ startDate, endDate, reason }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to apply for leave');
      }

      setMsg('Leave applied successfully!');
      setStartDate('');
      setEndDate('');
      setReason('');

      if (onLeaveApplied) {
        onLeaveApplied();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-card" style={{ marginBottom: '24px' }}>
      <h3 className="card-title" style={{ marginBottom: '18px' }}>
        Apply for Leave
      </h3>

      {msg && <div style={{ color: '#4ade80', fontSize: '13px', marginBottom: '12px' }}>{msg}</div>}
      {error && <div style={{ color: '#f87171', fontSize: '13px', marginBottom: '12px' }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label className="form-label">Start Date</label>
            <input
              type="date"
              className="form-control"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="form-label">End Date</label>
            <input
              type="date"
              className="form-control"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Reason</label>
          <input
            type="text"
            className="form-control"
            placeholder="Reason for leave"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="btn-primary-blue"
          style={{ width: '100%', padding: '12px', marginTop: '8px' }}
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Apply Leave'}
        </button>
      </form>
    </div>
  );
};

export default LeaveApply;
