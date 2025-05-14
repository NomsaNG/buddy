import Dexie from './node_modules/dexie/dist/dexie.mjs';

export const db = new Dexie("MyBuddyAppDB");

// Define your database schema
db.version(1).stores({
  users: '++id, name, email, income, password, expenses, transactions',// Auto-incrementing ID
  finances: '++id, userId, category, amount, classification, date',  // Example: Financial Records
  savings: '++id, userId, name, target, current, date', // Savings table
  accounts: '++id, userId, name, amount', // Accounts table
});

export default db;