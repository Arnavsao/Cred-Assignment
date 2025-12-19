import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { expenseAPI } from '../services/api';
import { calculateSplits, validateSplits } from '../utils/helpers';
import { MdAddCircle } from 'react-icons/md';

const AddExpense = ({ group, currentUserId, onExpenseAdded }) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    paidBy: currentUserId,
    splitType: 'EQUAL',
    category: 'General',
  });
  const [splits, setSplits] = useState(
    group.members.map(member => ({
      user: member._id,
      amount: 0,
      percentage: 0,
    }))
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'splitType') {
      resetSplits();
    }
  };

  const resetSplits = () => {
    setSplits(
      group.members.map(member => ({
        user: member._id,
        amount: 0,
        percentage: 0,
      }))
    );
  };

  const handleSplitChange = (userId, field, value) => {
    setSplits(prev =>
      prev.map(split =>
        split.user === userId
          ? { ...split, [field]: parseFloat(value) || 0 }
          : split
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const amount = parseFloat(formData.amount);
    if (!amount || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    let finalSplits = splits;
    if (formData.splitType === 'EQUAL') {
      finalSplits = calculateSplits(amount, 'EQUAL', splits);
    } else if (formData.splitType === 'PERCENTAGE') {
      if (!validateSplits(amount, 'PERCENTAGE', splits)) {
        setError('Percentages must add up to 100%');
        return;
      }
      finalSplits = calculateSplits(amount, 'PERCENTAGE', splits);
    } else if (formData.splitType === 'EXACT') {
      if (!validateSplits(amount, 'EXACT', splits)) {
        setError('Split amounts must equal total amount');
        return;
      }
    }

    try {
      setLoading(true);
      setError(null);
      await expenseAPI.create({
        ...formData,
        amount,
        group: group._id,
        splits: finalSplits,
      });

      toast.success('Expense added successfully!');
      setFormData({
        description: '',
        amount: '',
        paidBy: currentUserId,
        splitType: 'EQUAL',
        category: 'General',
      });
      resetSplits();

      if (onExpenseAdded) onExpenseAdded();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to add expense';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-expense">
      <h2>Add Expense</h2>
      <form onSubmit={handleSubmit}>
        {error && <div className="error">{error}</div>}

        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="amount">Amount *</label>
          <input
            type="number"
            id="amount"
            name="amount"
            step="0.01"
            min="0.01"
            value={formData.amount}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="paidBy">Paid By *</label>
          <select
            id="paidBy"
            name="paidBy"
            value={formData.paidBy}
            onChange={handleChange}
            required
          >
            {group.members.map(member => (
              <option key={member._id} value={member._id}>
                {member.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="splitType">Split Type *</label>
          <select
            id="splitType"
            name="splitType"
            value={formData.splitType}
            onChange={handleChange}
            required
          >
            <option value="EQUAL">Equal Split</option>
            <option value="EXACT">Exact Amount</option>
            <option value="PERCENTAGE">Percentage</option>
          </select>
        </div>

        {formData.splitType !== 'EQUAL' && (
          <div className="splits-section">
            <h3>Split Details</h3>
            {group.members.map(member => {
              const split = splits.find(s => s.user === member._id);
              return (
                <div key={member._id} className="split-row">
                  <span>{member.name}</span>
                  <input
                    type="number"
                    step={formData.splitType === 'PERCENTAGE' ? '0.01' : '0.01'}
                    min="0"
                    value={
                      formData.splitType === 'PERCENTAGE'
                        ? split?.percentage || 0
                        : split?.amount || 0
                    }
                    onChange={(e) =>
                      handleSplitChange(
                        member._id,
                        formData.splitType === 'PERCENTAGE' ? 'percentage' : 'amount',
                        e.target.value
                      )
                    }
                    placeholder={formData.splitType === 'PERCENTAGE' ? '%' : 'Amount'}
                  />
                </div>
              );
            })}
          </div>
        )}

        <button type="submit" disabled={loading}>
          <MdAddCircle /> {loading ? 'Adding...' : 'Add Expense'}
        </button>
      </form>
    </div>
  );
};

export default AddExpense;
