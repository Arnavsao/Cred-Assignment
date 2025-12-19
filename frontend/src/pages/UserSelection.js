import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { userAPI } from '../services/api';

const UserSelection = ({ onUserSelect }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getAll();
      setUsers(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      const response = await userAPI.create(formData);
      toast.success('User created successfully!');
      setFormData({ name: '', email: '', phone: '' });
      setShowCreateForm(false);
      await fetchUsers();
      onUserSelect(response.data.data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create user';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="user-selection">
      <div className="user-selection-container">
        <h1>Expense Sharing App</h1>

        {error && <div className="error">{error}</div>}

        {!showCreateForm ? (
          <>
            <h2>Select Your Account</h2>
            <div className="user-list">
              {users.map(user => (
                <button
                  key={user._id}
                  className="user-card"
                  onClick={() => onUserSelect(user)}
                >
                  <h3>{user.name}</h3>
                  <p>{user.email}</p>
                </button>
              ))}
            </div>
            <button
              className="create-user-btn"
              onClick={() => setShowCreateForm(true)}
            >
              Create New User
            </button>
          </>
        ) : (
          <div className="create-user-form">
            <h2>Create New User</h2>
            <form onSubmit={handleCreateUser}>
              <div className="form-group">
                <label htmlFor="name">Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-actions">
                <button type="submit">Create User</button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserSelection;
