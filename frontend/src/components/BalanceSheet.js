import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { balanceAPI, settlementAPI } from '../services/api';
import { formatCurrency } from '../utils/helpers';
import { MdTrendingUp, MdTrendingDown, MdCheckCircle, MdPayment } from 'react-icons/md';

const BalanceSheet = ({ groupId, userId }) => {
  const [balances, setBalances] = useState({
    owes: [],
    owed: [],
    summary: {
      totalOwes: 0,
      totalOwed: 0,
      netBalance: 0
    },
    group: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBalances();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId, userId]);

  const fetchBalances = async () => {
    try {
      setLoading(true);
      const response = await balanceAPI.getUserBalanceInGroup(userId, groupId);
      const data = response.data.data;
      setBalances({
        owes: data.owes || [],
        owed: data.owed || [],
        summary: {
          totalOwes: data.summary?.totalOwes || 0,
          totalOwed: data.summary?.totalOwed || 0,
          netBalance: data.summary?.netBalance || 0
        },
        group: data.group || ''
      });
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch balances');
    } finally {
      setLoading(false);
    }
  };

  const handleSettle = async (owesToId, amount) => {
    if (!window.confirm(`Settle ${formatCurrency(amount)}?`)) {
      return;
    }

    try {
      await settlementAPI.create({
        group: groupId,
        paidBy: userId,
        paidTo: owesToId,
        amount,
      });
      toast.success(`Successfully settled ${formatCurrency(amount)}`);
      fetchBalances();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create settlement');
    }
  };

  if (loading) return <div className="loading">Loading balances...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="balance-sheet">
      <div className="balance-header">
        <h2>Balance Summary</h2>
        {balances.group && (
          <p className="group-name-display">Group: {balances.group}</p>
        )}
      </div>

      <div className="balance-summary">
        <div className={`net-balance ${balances.summary.netBalance >= 0 ? 'positive' : 'negative'}`}>
          <h3>Your Net Balance</h3>
          <p className="amount">
            {balances.summary.netBalance > 0 && <MdTrendingUp className="balance-trend-icon" />}
            {balances.summary.netBalance < 0 && <MdTrendingDown className="balance-trend-icon" />}
            {balances.summary.netBalance === 0 && <MdCheckCircle className="balance-trend-icon" />}
            {formatCurrency(balances.summary.netBalance || 0)}
          </p>
          <p className="balance-subtitle">
            {balances.summary.netBalance > 0 ? 'You are owed' : balances.summary.netBalance < 0 ? 'You owe' : 'All settled up'}
          </p>
        </div>
        <div className="balance-detail">
          <div>
            <p>Total You Owe</p>
            <p className="amount negative">{formatCurrency(balances.summary.totalOwes || 0)}</p>
          </div>
          <div>
            <p>Total Owed to You</p>
            <p className="amount positive">{formatCurrency(balances.summary.totalOwed || 0)}</p>
          </div>
        </div>
      </div>

      {balances.owes.length > 0 && (
        <div className="balance-section owes-section">
          <h3>You Owe</h3>
          {balances.owes.map((balance) => (
            <div key={balance._id} className="balance-item">
              <div className="balance-info">
                <span className="user-name">{balance.owesTo.name}</span>
                <span className="amount negative">
                  {formatCurrency(balance.amount)}
                </span>
              </div>
              <button
                className="settle-btn"
                onClick={() => handleSettle(balance.owesTo._id, balance.amount)}
              >
                <MdPayment /> Settle Up
              </button>
            </div>
          ))}
        </div>
      )}

      {balances.owed.length > 0 && (
        <div className="balance-section owed-section">
          <h3>Owes You</h3>
          {balances.owed.map((balance) => (
            <div key={balance._id} className="balance-item">
              <span className="user-name">{balance.user.name}</span>
              <span className="amount positive">
                {formatCurrency(balance.amount)}
              </span>
            </div>
          ))}
        </div>
      )}

      {balances.owes.length === 0 && balances.owed.length === 0 && (
        <p className="no-balances">All settled up!</p>
      )}
    </div>
  );
};

export default BalanceSheet;
