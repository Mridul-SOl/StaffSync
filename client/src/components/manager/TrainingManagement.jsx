import React, { useState, useEffect } from 'react';

const TrainingManagement = () => {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [trainer, setTrainer] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  const fetchTrainings = async () => {
    try {
      const res = await fetch('/api/trainings', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setTrainings(data);
      }
    } catch (err) {
      console.error('Error fetching trainings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainings();
  }, [token]);

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setDate('');
    setDescription('');
    setTrainer('');
    setAssignedTo('');
  };

  const handleEdit = (train) => {
    setEditingId(train._id);
    setTitle(train.title);
    setDate(train.date ? train.date.split('T')[0] : '');
    setDescription(train.description);
    setTrainer(train.trainer || '');
    setAssignedTo(
      train.assignedTo && train.assignedTo.length > 0
        ? train.assignedTo.map((u) => u.name || u._id).join(', ')
        : ''
    );
    window.scrollTo({ top: 150, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this training module?')) return;
    try {
      const res = await fetch(`/api/trainings/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchTrainings();
      }
    } catch (err) {
      console.error('Error deleting training:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setError('');

    const payload = {
      title,
      description,
      date,
      trainer,
      assignedTo: assignedTo ? assignedTo.split(',').map((s) => s.trim()) : [],
    };

    try {
      let res;
      if (editingId) {
        res = await fetch(`/api/trainings/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/trainings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Operation failed');
      }

      setMsg(editingId ? 'Training updated successfully!' : 'Training created successfully!');
      resetForm();
      fetchTrainings();
    } catch (err) {
      setError(err.message);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US');
  };

  return (
    <div>
      {/* Form Card */}
      <div className="content-card" style={{ marginBottom: '28px' }}>
        <h3 className="card-title" style={{ marginBottom: '20px' }}>
          {editingId ? 'Edit Training' : 'Training & Development'}
        </h3>

        {msg && <div style={{ color: '#4ade80', fontSize: '13px', marginBottom: '12px' }}>{msg}</div>}
        {error && <div style={{ color: '#f87171', fontSize: '13px', marginBottom: '12px' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Row 1 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Training Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <input
              type="date"
              className="form-control"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          {/* Row 2 */}
          <div className="form-group">
            <textarea
              className="form-control"
              placeholder="Description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* Row 3 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Trainer Name"
              value={trainer}
              onChange={(e) => setTrainer(e.target.value)}
            />
            <input
              type="text"
              className="form-control"
              placeholder="Assign To (Employee ID or Names)"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="submit"
              className="btn-primary-blue"
              style={{ width: '100%', padding: '12px' }}
            >
              {editingId ? 'Save Training' : 'Create Training'}
            </button>
            {editingId && (
              <button
                type="button"
                className="btn-primary-blue"
                style={{ width: 'auto', backgroundColor: '#475569' }}
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Cards Grid */}
      {loading ? (
        <p style={{ color: '#94a3b8' }}>Loading trainings...</p>
      ) : (
        <div className="cards-grid">
          {trainings.length === 0 ? (
            <p style={{ color: '#94a3b8' }}>No training programs created yet.</p>
          ) : (
            trainings.map((train) => (
              <div key={train._id} className="training-program-card">
                <div style={{ fontSize: '17px', fontWeight: '700', color: '#ffffff', marginBottom: '8px' }}>
                  {train.title}
                </div>
                <p style={{ color: '#cbd5e1', fontSize: '13px', lineHeight: '1.5', marginBottom: '14px' }}>
                  {train.description}
                </p>
                <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.8', marginBottom: '16px' }}>
                  <div>
                    <strong style={{ color: '#ffffff' }}>Date:</strong> {formatDate(train.date)}
                  </div>
                  <div>
                    <strong style={{ color: '#ffffff' }}>Trainer:</strong> {train.trainer || 'TBD'}
                  </div>
                  <div>
                    <strong style={{ color: '#ffffff' }}>Assigned To:</strong>{' '}
                    {train.assignedTo && train.assignedTo.length > 0
                      ? train.assignedTo.map((u) => u.name || u).join(', ')
                      : 'N/A'}
                  </div>
                </div>
                <div>
                  <button className="btn-action-yellow" onClick={() => handleEdit(train)}>
                    Edit
                  </button>
                  <button className="btn-action-delete" onClick={() => handleDelete(train._id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default TrainingManagement;
