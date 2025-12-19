import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { expenseAPI, groupAPI } from '../services/api';
import './EditExpense.css';

const EditExpense = ({ expense, groupId, userId, onClose, onExpenseUpdated }) => {
  const [formData, setFormData] = useState({
    description: expense.description || '',
    amount: expense.amount || '',
    category: expense.category || 'Food',
    splitType: expense.splitType || 'equal',
  });

  const [groupMembers, setGroupMembers] = useState([]);
  const [splits, setSplits] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchGroupMembers();
    // Initialize splits from expense
    if (expense.splits && expense.splits.length > 0) {
      setSplits(expense.splits.map(split => ({
        user: split.user._id || split.user,
        amount: split.amount || 0,
        percentage: split.percentage || 0
      })));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchGroupMembers = async () => {
    try {
      const response = await groupAPI.getById(groupId);
      const members = response.data.data.members;
      setGroupMembers(members);

      // If splits not set yet, initialize with all members for equal split
      if (!expense.splits || expense.splits.length === 0) {
        const initialSplits = members.map(member => ({
          user: member._id,
          amount: 0,
          percentage: 0
        }));
        setSplits(initialSplits);
      }
    } catch (err) {
      toast.error('Failed to fetch group members');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Recalculate splits when amount or splitType changes
    if (name === 'amount' || name === 'splitType') {
      calculateSplits(name === 'amount' ? parseFloat(value) : formData.amount, name === 'splitType' ? value : formData.splitType);
    }
  };

  const calculateSplits = (amount, splitType) => {
    if (!amount || amount <= 0) return;

    if (splitType === 'equal') {
      const equalAmount = amount / splits.length;
      setSplits(splits.map(split => ({
        ...split,
        amount: parseFloat(equalAmount.toFixed(2)),
        percentage: 0
      })));
    } else if (splitType === 'percentage') {
      const equalPercentage = 100 / splits.length;
      setSplits(splits.map(split => ({
        ...split,
        percentage: parseFloat(equalPercentage.toFixed(2)),
        amount: parseFloat((amount * equalPercentage / 100).toFixed(2))
      })));
    } else if (splitType === 'exact') {
      // Keep existing amounts or reset to 0
      setSplits(splits.map(split => ({
        ...split,
        amount: split.amount || 0,
        percentage: 0
      })));
    }
  };

  const handleSplitChange = (index, value) => {
    const newSplits = [...splits];
    const numValue = parseFloat(value) || 0;

    if (formData.splitType === 'percentage') {
      newSplits[index].percentage = numValue;
      newSplits[index].amount = parseFloat((formData.amount * numValue / 100).toFixed(2));
    } else {
      newSplits[index].amount = numValue;
    }

    setSplits(newSplits);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.description.trim()) {
      toast.error('Please enter a description');
      return;
    }

    if (!formData.amount || formData.amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    // Validate splits
    const totalSplit = splits.reduce((sum, split) => {
      return sum + (formData.splitType === 'percentage' ? split.percentage : split.amount);
    }, 0);

    const expectedTotal = formData.splitType === 'percentage' ? 100 : parseFloat(formData.amount);
    const tolerance = 0.01;

    if (Math.abs(totalSplit - expectedTotal) > tolerance) {
      toast.error(
        formData.splitType === 'percentage'
          ? 'Percentages must add up to 100%'
          : 'Split amounts must equal the total amount'
      );
      return;
    }

    try {
      setLoading(true);
      await expenseAPI.update(expense._id, {
        ...formData,
        splits: splits.filter(split => split.amount > 0),
        userId
      });

      toast.success('Expense updated successfully!');
      onExpenseUpdated();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Expense</h2>
          <button className="close-modal-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Description *</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="e.g., Dinner at restaurant"
              required
            />
          </div>

          <div className="form-group">
            <label>Amount *</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="Food">Food</option>
              <option value="Transportation">Transportation</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Utilities">Utilities</option>
              <option value="Shopping">Shopping</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Split Type</label>
            <select
              name="splitType"
              value={formData.splitType}
              onChange={handleChange}
            >
              <option value="equal">Equal Split</option>
              <option value="exact">Exact Amounts</option>
              <option value="percentage">Percentage</option>
            </select>
          </div>

          <div className="splits-section">
            <h3>Split Details</h3>
            {splits.map((split, index) => {
              const member = groupMembers.find(m => m._id === split.user);
              return (
                <div key={split.user} className="split-row">
                  <span>{member?.name || 'Unknown'}</span>
                  <input
                    type="number"
                    value={formData.splitType === 'percentage' ? split.percentage : split.amount}
                    onChange={(e) => handleSplitChange(index, e.target.value)}
                    step="0.01"
                    min="0"
                    disabled={formData.splitType === 'equal'}
                    placeholder={formData.splitType === 'percentage' ? '0%' : '0.00'}
                  />
                </div>
              );
            })}
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditExpense;
