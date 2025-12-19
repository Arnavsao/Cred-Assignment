// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
};

// Format date
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Calculate split amounts
export const calculateSplits = (amount, splitType, splits) => {
  if (splitType === 'EQUAL') {
    const equalAmount = amount / splits.length;
    return splits.map(split => ({
      ...split,
      amount: parseFloat(equalAmount.toFixed(2)),
    }));
  } else if (splitType === 'PERCENTAGE') {
    return splits.map(split => ({
      ...split,
      amount: parseFloat((amount * split.percentage / 100).toFixed(2)),
    }));
  }
  return splits;
};

// Validate splits
export const validateSplits = (amount, splitType, splits) => {
  if (splitType === 'EXACT') {
    const total = splits.reduce((sum, split) => sum + (split.amount || 0), 0);
    return Math.abs(total - amount) < 0.01;
  } else if (splitType === 'PERCENTAGE') {
    const total = splits.reduce((sum, split) => sum + (split.percentage || 0), 0);
    return Math.abs(total - 100) < 0.01;
  }
  return true;
};
