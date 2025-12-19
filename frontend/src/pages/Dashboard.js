import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import GroupList from '../components/GroupList';
import CreateGroup from '../components/CreateGroup';
import AddExpense from '../components/AddExpense';
import ExpenseList from '../components/ExpenseList';
import BalanceSheet from '../components/BalanceSheet';
import Settings from './Settings';

const Dashboard = ({ currentUser, onLogout }) => {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [activeTab, setActiveTab] = useState('groups');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleGroupCreated = () => {
    setRefreshTrigger(prev => prev + 1);
    setActiveTab('groups');
  };

  const handleExpenseAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleSelectGroup = (group) => {
    setSelectedGroup(group);
    setActiveTab('expenses');
  };

  return (
    <div className="dashboard">
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedGroup={selectedGroup}
        onLogout={onLogout}
      />

      <div className="dashboard-content">
        <main className="dashboard-main">
          {selectedGroup && activeTab !== 'settings' && activeTab !== 'groups' && activeTab !== 'create-group' && (
            <div className="selected-group-info">
              <h2>{selectedGroup.name}</h2>
              {selectedGroup.description && <p>{selectedGroup.description}</p>}
            </div>
          )}

          {activeTab === 'groups' && (
            <GroupList
              userId={currentUser._id}
              onSelectGroup={handleSelectGroup}
              key={refreshTrigger}
            />
          )}

          {activeTab === 'create-group' && (
            <CreateGroup
              currentUserId={currentUser._id}
              onGroupCreated={handleGroupCreated}
            />
          )}

          {activeTab === 'expenses' && selectedGroup && (
            <ExpenseList
              groupId={selectedGroup._id}
              userId={currentUser._id}
              key={refreshTrigger}
            />
          )}

          {activeTab === 'add-expense' && selectedGroup && (
            <AddExpense
              group={selectedGroup}
              currentUserId={currentUser._id}
              onExpenseAdded={handleExpenseAdded}
            />
          )}

          {activeTab === 'balances' && selectedGroup && (
            <BalanceSheet
              groupId={selectedGroup._id}
              userId={currentUser._id}
              key={refreshTrigger}
            />
          )}

          {activeTab === 'settings' && (
            <Settings currentUser={currentUser} />
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
