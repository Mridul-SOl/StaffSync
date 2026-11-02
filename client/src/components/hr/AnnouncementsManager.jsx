import React, { useState, useEffect } from 'react';

const AnnouncementsManager = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetAudience, setTargetAudience] = useState('All');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch('/api/announcements', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setAnnouncements(data);
      }
    } catch (err) {
      console.error('Error fetching announcements:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, message, targetAudience }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to post announcement');
      }

      setMsg('Announcement created successfully!');
      setTitle('');
      setMessage('');
      setTargetAudience('All');
      fetchAnnouncements();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this announcement?')) return;
    try {
      const res = await fetch(`/api/announcements/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchAnnouncements();
      }
    } catch (err) {
      console.error('Error deleting announcement:', err);
    }
  };

  return (
    <div>
      {/* Form Card */}
      <div className="content-card" style={{ marginBottom: '28px' }}>
        <h3 className="card-title" style={{ marginBottom: '20px' }}>
          Announcements
        </h3>

        {msg && <div style={{ color: '#4ade80', fontSize: '13px', marginBottom: '12px' }}>{msg}</div>}
        {error && <div style={{ color: '#f87171', fontSize: '13px', marginBottom: '12px' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <textarea
              className="form-control"
              placeholder="Message"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <select
              className="form-control"
              style={{ width: '160px' }}
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Employees">Employees</option>
              <option value="Managers">Managers</option>
            </select>

            <button
              type="submit"
              className="btn-logout"
              style={{ padding: '10px 24px' }}
              disabled={submitting}
            >
              {submitting ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>

      {/* Announcements List */}
      <div className="content-card">
        <h3 className="card-title" style={{ marginBottom: '18px' }}>
          Posted Announcements
        </h3>

        {loading ? (
          <p style={{ color: '#94a3b8' }}>Loading announcements...</p>
        ) : announcements.length === 0 ? (
          <p style={{ color: '#94a3b8' }}>No announcements created yet.</p>
        ) : (
          announcements.map((a) => (
            <div key={a._id} className="list-item-card">
              <div>
                <div className="item-main-title">{a.title}</div>
                <div style={{ color: '#cbd5e1', fontSize: '13px', margin: '4px 0' }}>{a.message}</div>
                <div className="item-subtext" style={{ fontSize: '11px' }}>
                  Audience: {a.targetAudience} • {new Date(a.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div>
                <button className="btn-action-delete" onClick={() => handleDelete(a._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AnnouncementsManager;
