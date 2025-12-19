import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { groupAPI, userAPI } from '../services/api';
import { MdGroupAdd } from 'react-icons/md';

const CreateGroup = ({ currentUserId, onGroupCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    members: [currentUserId],
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await userAPI.getAll();
      setUsers(response.data.data.filter(user => user._id !== currentUserId));
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMemberToggle = (userId) => {
    setFormData(prev => {
      const members = prev.members.includes(userId)
        ? prev.members.filter(id => id !== userId)
        : [...prev.members, userId];
      return { ...prev, members };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.members.length < 2) {
      setError('Please select at least one other member');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await groupAPI.create({
        ...formData,
        createdBy: currentUserId,
      });
      toast.success('Group created successfully!');
      setFormData({
        name: '',
        description: '',
        members: [currentUserId],
      });
      if (onGroupCreated) onGroupCreated();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create group';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-group">
      <h2>Create New Group</h2>
      <form onSubmit={handleSubmit}>
        {error && <div className="error">{error}</div>}

        <div className="form-group">
          <label htmlFor="name">Group Name *</label>
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
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
          />
        </div>

        <div className="form-group">
          <label>Select Members *</label>
          <div className="member-list">
            {users.map(user => (
              <label key={user._id} className="member-checkbox">
                <input
                  type="checkbox"
                  checked={formData.members.includes(user._id)}
                  onChange={() => handleMemberToggle(user._id)}
                />
                {user.name} ({user.email})
              </label>
            ))}
          </div>
        </div>

        <button type="submit" disabled={loading}>
          <MdGroupAdd /> {loading ? 'Creating...' : 'Create Group'}
        </button>
      </form>
    </div>
  );
};

export default CreateGroup;
