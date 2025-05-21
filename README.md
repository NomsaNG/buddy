# 💰 MyBuddyApp

**MyBuddyApp** is a personal finance Progressive Web App (PWA) that helps users manage their money, set savings goals, track income and expenses, and visualize their financial health over time.

---

## 🚀 Features

- 🔐 **User Authentication**
  - Register and log in using email and password
  - Sessions stored locally for seamless navigation

- 🧾 **Accounts Management**
  - Add and track multiple accounts (e.g., bank, wallet)
  - Display account balances and updates

- 📈 **Income & Expenses Tracking**
  - Log recurring or one-time income
  - Add categorized expenses with classification tags
  - View real-time transaction history

- 🏦 **Savings Goals**
  - Create and track progress toward savings targets
  - Visual representation (e.g., water bottle fill animation)

- 📊 **Statistics Dashboard**
  - Filter transactions by day/week/month/year
  - Visualize income, expenses, and savings
  - Top spending categories and history

- 🧠 **Offline-First**
  - Uses [Dexie.js](https://dexie.org/) for local IndexedDB storage
  - Fully functional offline with data persistence

- 📱 **PWA-Ready**
  - Installable on mobile and desktop
  - App-like experience with fast loading and caching

---

## 🧩 Tech Stack

| Frontend        | Backend (Local) | Storage      |
|----------------|------------------|--------------|
| HTML5 + CSS3   | JavaScript (ES6) | Dexie.js (IndexedDB) |
| Vanilla JS Modules | No server required | LocalStorage (for session) |
| Font Awesome   |                  |              |

---

## 📁 Project Structure

```plaintext
mybuddyapp/
├── assets/                    # Images, icons, and static media
│   ├── profile.png
│   └── ...
├── styles/                    # CSS stylesheets
│   └── style.css
├── database.js                # Dexie.js IndexedDB setup and schema
├── index.html                 # Home dashboard (total balance, income, expenses, transactions)
├── login.html                 # User login page
├── register.html              # User registration page
├── accounts.html              # View and manage user accounts and savings
├── add-account.html           # Modal to add accounts or savings goals
├── stats.html                 # Statistics page with charts, filters (day/week/month/year)
├── profile.html               # User profile page (displays name, email, and settings)
├── bottom-nav.html            # Reusable bottom navigation bar component
├── manifest.json              # (Optional) Web app manifest for PWA support
├── service-worker.js          # (Optional) Service worker for offline support and caching
└── README.md                  # Project documentation
```

## 📦 Dexie.js Schema

```js
db.version(1).stores({
  users: '++id, name, email, password',
  finances: '++id, userId, category, amount, classification, date, accountId',
  savings: '++id, userId, name, target, current, date',
  accounts: '++id, userId, name, amount',
  income: '++id, userId, name, amount, date, accountId, isRecurring',
  transactions: '++id, userId, type, name, amount, date, sourceId'
});
```

## Setup Instructions
1. Clone 

```bash
git clone https://github.com/yourusername/mybuddyapp.git
cd mybuddyapp
```

2. Open with a local development server
Use VSCode Live Server or any local HTTP server.

3. Open in Browseer
Visit: http://localhost:3000 or your Live Server URL.

4. Register and explore the app

## PWA Installation 
To install on your device:
1. Open the app in Chrome or Edge
2. Click the "Install App" icon in the address bar
3. Use it like a native mobile or desktop app!

## To-Do/Future Features
* Profile editing
* Cloud sync or export options
* Dark mode toggle