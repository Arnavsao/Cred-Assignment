import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { expenseAPI } from '../services/api';
import { formatCurrency, formatDate } from '../utils/helpers';
import { MdEdit, MdDelete, MdPerson, MdCalendarToday, MdCategory, MdSplitscreen } from 'react-icons/md';
import EditExpense from './EditExpense';

const ExpenseList = ({ groupId, userId }) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingExpense, setEditingExpense] = useState(null);

  useEffect(() => {
    fetchExpenses();
  }, [groupId]);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await expenseAPI.getByGroup(groupId);
      setExpenses(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch expenses');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (expenseId) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) {
      return;
    }

    try {
      await expenseAPI.delete(expenseId, { userId });
      toast.success('Expense deleted successfully');
      fetchExpenses();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete expense');
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
  };

  const handleCloseEdit = () => {
    setEditingExpense(null);
  };

  const handleExpenseUpdated = () => {
    fetchExpenses();
  };

  if (loading) return <div className="loading">Loading expenses...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="expense-list">
      <h2>Expenses</h2>
      {expenses.length === 0 ? (
        <p>No expenses yet. Add your first expense to get started.</p>
      ) : (
        <div className="expenses">
          {expenses.map((expense) => (
            <div key={expense._id} className="expense-card">
              <div className="expense-header">
                <h3>{expense.description}</h3>
                <span className="expense-amount">
                  {formatCurrency(expense.amount)}
                </span>
              </div>
              <div className="expense-details">
                <p>
                  <MdPerson className="detail-icon" />
                  Paid by: <strong>{expense.paidBy.name}</strong>
                </p>
                <p>
                  <MdCalendarToday className="detail-icon" />
                  {formatDate(expense.date)}
                </p>
                <p>
                  <MdCategory className="detail-icon" />
                  {expense.category}
                </p>
                <p>
                  <MdSplitscreen className="detail-icon" />
                  {expense.splitType}
                </p>
              </div>
              <div className="expense-splits">
                <h4>Split Between:</h4>
                {expense.splits.map((split, index) => (
                  <div key={index} className="split-item">
                    <span>{split.user.name}</span>
                    <span>{formatCurrency(split.amount)}</span>
                  </div>
                ))}
              </div>

              {/* Show edit/delete buttons only if current user is the creator */}
              {expense.paidBy._id === userId && (
                <div className="expense-actions">
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(expense)}
                  >
                    <MdEdit /> Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(expense._id)}
                  >
                    <MdDelete /> Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Edit Expense Modal */}
      {editingExpense && (
        <EditExpense
          expense={editingExpense}
          groupId={groupId}
          userId={userId}
          onClose={handleCloseEdit}
          onExpenseUpdated={handleExpenseUpdated}
        />
      )}
    </div>
  );
};

export default ExpenseList;
