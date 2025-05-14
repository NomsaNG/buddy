import { db } from './database.js';

document.addEventListener('DOMContentLoaded', async () => {
  const userId = parseInt(localStorage.getItem('loggedInUserId'), 10);
  if (!userId) return;

  // Fetch user info (for income)
  const user = await db.users.get(userId);
  let income = user?.income || 0;

  // Fetch total active expenses (not canceled)
  const expenses = await db.finances
    .where({ userId })
    .and(exp => !exp.canceled) // Filter out canceled ones
    .toArray();
  const totalExpenses = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);

  // Fetch all accounts for the user
  const accounts = await db.accounts.where('userId').equals(userId).toArray();
  const totalAccounts = accounts.reduce((sum, acc) => sum + (acc.amount || 0), 0);

  // Fetch all savings for the user
  const savings = await db.savings.where('userId').equals(userId).toArray();
  const totalSavings = savings.reduce((sum, sav) => sum + (sav.amount || 0), 0);

  // Calculate total balance
  const balance = income + totalAccounts + totalSavings - totalExpenses;

  // Display
  document.getElementById('total-balance').textContent = `R ${balance.toFixed(2)}`;
});
