import React from 'react';
import { toast } from 'react-toastify';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import { MdDarkMode, MdLightMode } from 'react-icons/md';
import './Settings.css';

const Settings = ({ currentUser }) => {
  const { theme, toggleTheme } = useTheme();
  const { avatar, setAvatar, availableAvatars } = useUser();

  const handleAvatarSelect = (selectedAvatar) => {
    setAvatar(selectedAvatar);
    toast.success('Avatar updated successfully!');
  };

  return (
    <div className="settings-page">
      <h1>Settings</h1>

      {/* Profile Section */}
      <div className="settings-section">
        <h2>Profile</h2>
        <div className="profile-info">
          <div className="avatar-display">
            <span className="avatar-large">{avatar}</span>
          </div>
          <div className="user-details">
            <h3>{currentUser.name}</h3>
            <p>{currentUser.email}</p>
            {currentUser.phone && <p>{currentUser.phone}</p>}
          </div>
        </div>
      </div>

      {/* Avatar Selection */}
      <div className="settings-section">
        <h2>Choose Avatar</h2>
        <div className="avatar-grid">
          {availableAvatars.map((av, index) => (
            <button
              key={index}
              className={`avatar-option ${avatar === av ? 'selected' : ''}`}
              onClick={() => handleAvatarSelect(av)}
            >
              {av}
            </button>
          ))}
        </div>
      </div>

      {/* Theme Section */}
      <div className="settings-section">
        <h2>Appearance</h2>
        <div className="theme-toggle">
          <div className="theme-info">
            <h3>Theme</h3>
            <p>Choose your preferred color scheme</p>
          </div>
          <button
            className="toggle-button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            <span className="toggle-icon">
              {theme === 'light' ? <MdDarkMode /> : <MdLightMode />}
            </span>
            <span className="toggle-label">
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </span>
          </button>
        </div>
      </div>

      {/* Preferences Section */}
      <div className="settings-section">
        <h2>Preferences</h2>
        <div className="preference-item">
          <div>
            <h3>Currency</h3>
            <p>Default currency for expenses</p>
          </div>
          <select className="preference-select" defaultValue="INR">
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="INR">INR (₹)</option>
          </select>
        </div>
      </div>

      {/* About Section */}
      <div className="settings-section">
        <h2>About</h2>
        <div className="about-info">
          <p><strong>Version:</strong> 1.0.0</p>
          <p><strong>Last Updated:</strong> December 2024</p>
          <p>A Splitwise-inspired expense sharing application</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
