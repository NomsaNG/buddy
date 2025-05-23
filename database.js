import Dexie from './assets/node_modules/dexie/dist/dexie.mjs';

export const db = new Dexie("MyBuddyAppDB");

db.version(1).stores({
  users: '++id, name, email, password',
  finances: '++id, userId, category, amount, classification, date, accountId',
  savings: '++id, userId, name, target, current, date',
  accounts: '++id, userId, name, amount',
  income: '++id, userId, name, amount, date, accountId, isRecurring',
  transactions: '++id, userId, type, name, amount, date, sourceId',
  shopping: '++id, userId, name, category, priority, price, purchased'  
});

export default db;
