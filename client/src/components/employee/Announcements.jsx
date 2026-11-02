import React, { useState, useEffect } from 'react';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resAnnounce, resTrain] = await Promise.all([
          fetch('/api/announcements', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('/api/trainings', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (resAnnounce.ok) {
          const data = await resAnnounce.json();
          setAnnouncements(data);
        }
        if (resTrain.ok) {
          const data = await resTrain.json();
          setTrainings(data);
        }
      } catch (err) {
        console.error('Error fetching announcements/trainings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  return (
    <div className="two-column-grid">
      {/* Left Column: Announcements */}
      <div className="content-card">
        <h3 className="card-title" style={{ marginBottom: '18px' }}>
          Announcements
        </h3>
        {loading ? (
          <p style={{ color: '#94a3b8' }}>Loading announcements...</p>
        ) : announcements.length === 0 ? (
          <p style={{ color: '#94a3b8' }}>No announcements available.</p>
        ) : (
          announcements.map((item) => (
            <div key={item._id} className="list-item-card" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
              <div className="item-main-title">{item.title}</div>
              <p style={{ color: '#cbd5e1', fontSize: '13px', margin: '4px 0 8px' }}>
                {item.message}
              </p>
              <div className="item-subtext" style={{ fontSize: '11px' }}>
                Posted by {item.createdBy?.name || 'HR'} • Audience: {item.targetAudience}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Right Column: Trainings */}
      <div className="content-card">
        <h3 className="card-title" style={{ marginBottom: '18px' }}>
          Trainings
        </h3>
        {loading ? (
          <p style={{ color: '#94a3b8' }}>Loading trainings...</p>
        ) : trainings.length === 0 ? (
          <p style={{ color: '#94a3b8' }}>No training programs assigned currently.</p>
        ) : (
          trainings.map((train) => (
            <div
              key={train._id}
              className="list-item-card"
              style={{ flexDirection: 'column', alignItems: 'flex-start', marginBottom: '14px' }}
            >
              <div className="item-main-title" style={{ fontSize: '16px' }}>
                {train.title}
              </div>
              <p style={{ color: '#cbd5e1', fontSize: '13px', margin: '6px 0 10px' }}>
                {train.description}
              </p>
              <div style={{ color: '#94a3b8', fontSize: '12px', lineHeight: '1.6' }}>
                <div><strong>Trainer:</strong> {train.trainer || 'TBD'}</div>
                <div><strong>Date:</strong> {new Date(train.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Announcements;
