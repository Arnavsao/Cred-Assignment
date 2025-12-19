import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { MdDashboard, MdGroupAdd, MdAttachMoney, MdAddCircle, MdAccountBalance, MdSettings, MdLogout } from 'react-icons/md';
import './Navbar.css';

const Navbar = ({ currentUser, activeTab, setActiveTab, selectedGroup, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { avatar } = useUser();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="dashboard-header">
        <div className="header-left">
          <button
            className="hamburger"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          <div className="header-title">
            <h1>ContriPlz</h1>
            {selectedGroup && (
              <span className="group-badge">
                {selectedGroup.name}
              </span>
            )}
          </div>
        </div>

        <div className="header-right">
          <div className="user-info">
            <span className="avatar-small">{avatar}</span>
            <span className="user-name">{currentUser.name}</span>
          </div>
        </div>
      </header>

      {/* Mobile/Tablet Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="sidebar-overlay" onClick={toggleMobileMenu}></div>
      )}

      {/* Sidebar Navigation */}
      <nav className={`dashboard-nav ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="nav-header">
          <button className="close-btn" onClick={toggleMobileMenu}>×</button>
        </div>

        <div className="nav-links">
          <button
            className={activeTab === 'groups' ? 'active' : ''}
            onClick={() => handleNavClick('groups')}
          >
            <span className="nav-icon"><MdDashboard /></span>
            Groups
          </button>

          <button
            className={activeTab === 'create-group' ? 'active' : ''}
            onClick={() => handleNavClick('create-group')}
          >
            <span className="nav-icon"><MdGroupAdd /></span>
            Create Group
          </button>

          {selectedGroup && (
            <>
              <div className="nav-divider"></div>
              <div className="nav-group-info">
                <p>{selectedGroup.name}</p>
              </div>

              <button
                className={activeTab === 'expenses' ? 'active' : ''}
                onClick={() => handleNavClick('expenses')}
              >
                <span className="nav-icon"><MdAttachMoney /></span>
                Expenses
              </button>

              <button
                className={activeTab === 'add-expense' ? 'active' : ''}
                onClick={() => handleNavClick('add-expense')}
              >
                <span className="nav-icon"><MdAddCircle /></span>
                Add Expense
              </button>

              <button
                className={activeTab === 'balances' ? 'active' : ''}
                onClick={() => handleNavClick('balances')}
              >
                <span className="nav-icon"><MdAccountBalance /></span>
                Balances
              </button>
            </>
          )}

          <div className="nav-divider"></div>

          <button
            className={activeTab === 'settings' ? 'active' : ''}
            onClick={() => handleNavClick('settings')}
          >
            <span className="nav-icon"><MdSettings /></span>
            Settings
          </button>

          <button className="logout-nav-btn" onClick={onLogout}>
            <span className="nav-icon"><MdLogout /></span>
            Logout
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
