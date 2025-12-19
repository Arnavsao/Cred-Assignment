import React, { useState, useEffect } from 'react';
import { groupAPI } from '../services/api';

const GroupList = ({ userId, onSelectGroup }) => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGroups();
  }, [userId]);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await groupAPI.getUserGroups(userId);
      setGroups(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch groups');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading groups...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="group-list">
      <h2>Your Groups</h2>
      {groups.length === 0 ? (
        <p>No groups found. Create a new group to get started.</p>
      ) : (
        <div className="groups-grid">
          {groups.map((group) => (
            <div
              key={group._id}
              className="group-card"
              onClick={() => onSelectGroup(group)}
            >
              <h3>{group.name}</h3>
              {group.description && <p>{group.description}</p>}
              <div className="group-info">
                <span>{group.members.length} members</span>
                <span>{group.expenses?.length || 0} expenses</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GroupList;
