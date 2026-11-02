import React, { useState, useEffect } from 'react';

const EmployeeCRUD = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [position, setPosition] = useState('');
  const [salary, setSalary] = useState('');
  const [joinDate, setJoinDate] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  const fetchEmployees = async () => {
    try {
      const res = await fetch('/api/employees', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setEmployees(data);
      }
    } catch (err) {
      console.error('Error fetching employees:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [token]);

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setEmail('');
    setDepartment('');
    setPosition('');
    setSalary('');
    setJoinDate('');
    setPhone('');
    setAddress('');
  };

  const handleEdit = (emp) => {
    setEditingId(emp._id);
    setName(emp.name);
    setEmail(emp.email);
    setDepartment(emp.department);
    setPosition(emp.position);
    setSalary(emp.salary);
    setJoinDate(emp.joinDate ? emp.joinDate.split('T')[0] : '');
    setPhone(emp.phone || '');
    setAddress(emp.address || '');
    window.scrollTo({ top: 150, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    try {
      const res = await fetch(`/api/employees/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchEmployees();
      }
    } catch (err) {
      console.error('Error deleting employee:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setError('');

    const payload = {
      name,
      email,
      department,
      position,
      salary: Number(salary),
      joinDate,
      phone,
      address,
    };

    try {
      let res;
      if (editingId) {
        res = await fetch(`/api/employees/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/employees', {
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

      setMsg(editingId ? 'Employee updated successfully!' : 'Employee added successfully!');
      resetForm();
      fetchEmployees();
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
          {editingId ? 'Edit Employee' : 'Employee Management'}
        </h3>

        {msg && <div style={{ color: '#4ade80', fontSize: '13px', marginBottom: '12px' }}>{msg}</div>}
        {error && <div style={{ color: '#f87171', fontSize: '13px', marginBottom: '12px' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Row 1 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="text"
              className="form-control"
              placeholder="Department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required
            />
          </div>

          {/* Row 2 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              required
            />
            <input
              type="number"
              className="form-control"
              placeholder="Salary"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              required
            />
            <input
              type="date"
              className="form-control"
              value={joinDate}
              onChange={(e) => setJoinDate(e.target.value)}
              required
            />
          </div>

          {/* Row 3 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <input
              type="text"
              className="form-control"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="submit" className="btn-crimson">
              {editingId ? 'Save Changes' : 'Add Employee'}
            </button>
            {editingId && (
              <button
                type="button"
                className="btn-primary-blue"
                style={{ width: 'auto', marginTop: '10px', backgroundColor: '#475569' }}
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Table Card */}
      <div className="content-card">
        {loading ? (
          <p style={{ color: '#94a3b8' }}>Loading employees...</p>
        ) : (
          <div className="hrm-table-wrapper">
            <table className="hrm-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Position</th>
                  <th>Salary</th>
                  <th>Join Date</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.length === 0 ? (
                  <tr>
                    <td colSpan="9" style={{ textAlign: 'center', color: '#94a3b8' }}>
                      No employees recorded. Add one using the form above.
                    </td>
                  </tr>
                ) : (
                  employees.map((emp) => (
                    <tr key={emp._id}>
                      <td>{emp.name}</td>
                      <td>{emp.email}</td>
                      <td>{emp.department}</td>
                      <td>{emp.position}</td>
                      <td>₹{emp.salary}</td>
                      <td>{formatDate(emp.joinDate)}</td>
                      <td>{emp.phone || '-'}</td>
                      <td>{emp.address || '-'}</td>
                      <td>
                        <button className="btn-action-edit" onClick={() => handleEdit(emp)}>
                          Edit
                        </button>
                        <button className="btn-action-delete" onClick={() => handleDelete(emp._id)}>
                          Delete
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
    </div>
  );
};

export default EmployeeCRUD;
