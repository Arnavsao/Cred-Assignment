/**
 * Simplifies balances using a greedy algorithm
 * This reduces the number of transactions needed to settle all debts
 *
 * Algorithm:
 * 1. Calculate net balance for each user (total owed - total owing)
 * 2. Split users into creditors (positive balance) and debtors (negative balance)
 * 3. Match largest creditor with largest debtor repeatedly
 * 4. This minimizes the number of transactions
 */

class BalanceSimplifier {
  /**
   * Simplifies balances for a group
   * @param {Array} balances - Array of balance objects with user, owesTo, and amount
   * @returns {Array} - Simplified array of balances
   */
  static simplifyBalances(balances) {
    // Calculate net balance for each user
    const netBalances = this.calculateNetBalances(balances);

    // Separate creditors and debtors
    const creditors = [];
    const debtors = [];

    Object.entries(netBalances).forEach(([userId, balance]) => {
      if (balance > 0.01) { // Creditor (someone owes them)
        creditors.push({ userId, amount: balance });
      } else if (balance < -0.01) { // Debtor (they owe someone)
        debtors.push({ userId, amount: -balance });
      }
    });

    // Sort in descending order for greedy algorithm
    creditors.sort((a, b) => b.amount - a.amount);
    debtors.sort((a, b) => b.amount - a.amount);

    // Generate simplified transactions
    return this.generateSimplifiedTransactions(creditors, debtors);
  }

  /**
   * Calculate net balance for each user
   * Net balance = (amount others owe to user) - (amount user owes to others)
   */
  static calculateNetBalances(balances) {
    const netBalances = {};

    balances.forEach(balance => {
      const { user, owesTo, amount } = balance;

      // Initialize if not exists
      if (!netBalances[user]) netBalances[user] = 0;
      if (!netBalances[owesTo]) netBalances[owesTo] = 0;

      // User owes money (negative impact on their balance)
      netBalances[user] -= amount;

      // OwesTo receives money (positive impact on their balance)
      netBalances[owesTo] += amount;
    });

    return netBalances;
  }

  /**
   * Generate simplified transactions using greedy approach
   */
  static generateSimplifiedTransactions(creditors, debtors) {
    const simplifiedBalances = [];
    let i = 0; // Creditor index
    let j = 0; // Debtor index

    while (i < creditors.length && j < debtors.length) {
      const creditor = creditors[i];
      const debtor = debtors[j];

      // Determine transaction amount (minimum of what debtor owes and creditor is owed)
      const transactionAmount = Math.min(creditor.amount, debtor.amount);

      // Create simplified balance record
      simplifiedBalances.push({
        user: debtor.userId,
        owesTo: creditor.userId,
        amount: parseFloat(transactionAmount.toFixed(2)),
      });

      // Update remaining amounts
      creditor.amount -= transactionAmount;
      debtor.amount -= transactionAmount;

      // Move to next creditor if current one is fully paid
      if (creditor.amount < 0.01) i++;

      // Move to next debtor if current one has paid all debts
      if (debtor.amount < 0.01) j++;
    }

    return simplifiedBalances;
  }

  /**
   * Calculate balances from expenses for a group
   * @param {Array} expenses - Array of expense objects
   * @returns {Array} - Array of balance records
   */
  static calculateBalancesFromExpenses(expenses) {
    const balanceMap = new Map();

    expenses.forEach(expense => {
      const paidBy = expense.paidBy._id ? expense.paidBy._id.toString() : expense.paidBy.toString();

      expense.splits.forEach(split => {
        const user = split.user._id ? split.user._id.toString() : split.user.toString();

        // Skip if user paid for themselves
        if (user === paidBy) return;

        // Create unique key for this balance relationship
        const key = `${user}-${paidBy}`;
        const reverseKey = `${paidBy}-${user}`;

        // Check if reverse relationship exists
        if (balanceMap.has(reverseKey)) {
          const existing = balanceMap.get(reverseKey);
          const newAmount = existing.amount - split.amount;

          if (newAmount > 0.01) {
            // Reverse relationship still stands
            balanceMap.set(reverseKey, { ...existing, amount: newAmount });
          } else if (newAmount < -0.01) {
            // Direction flips
            balanceMap.delete(reverseKey);
            balanceMap.set(key, {
              user,
              owesTo: paidBy,
              amount: -newAmount,
            });
          } else {
            // They're even, remove the balance
            balanceMap.delete(reverseKey);
          }
        } else {
          // Add or update existing balance
          const existing = balanceMap.get(key);
          const newAmount = (existing?.amount || 0) + split.amount;

          balanceMap.set(key, {
            user,
            owesTo: paidBy,
            amount: newAmount,
          });
        }
      });
    });

    return Array.from(balanceMap.values())
      .filter(balance => balance.amount > 0.01)
      .map(balance => ({
        ...balance,
        amount: parseFloat(balance.amount.toFixed(2)),
      }));
  }
}

module.exports = BalanceSimplifier;
