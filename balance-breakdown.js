import db from './database.js';

// UI tab toggle
const savingGoalTab = document.getElementById('saving-goal-tab');
const accountsTab = document.getElementById('accounts-tab');
const savingGoalView = document.getElementById('saving-goal-view');
const accountsView = document.getElementById('accounts-view');

savingGoalTab.addEventListener('click', () => {
    savingGoalTab.classList.add('active');
    accountsTab.classList.remove('active');
    savingGoalView.style.display = 'block';
    accountsView.style.display = 'none';
});

accountsTab.addEventListener('click', () => {
    accountsTab.classList.add('active');
    savingGoalTab.classList.remove('active');
    savingGoalView.style.display = 'none';
    accountsView.style.display = 'block';
});

// Modal logic
const addButton = document.getElementById('add-button');
const addAccountModal = document.getElementById('add-account-modal');
const addGoalModal = document.getElementById('add-goal-modal');

const cancelAddAccount = document.getElementById('cancel-add-account');
const confirmAddAccount = document.getElementById('confirm-add-account');

const cancelAddGoal = document.getElementById('cancel-add-goal');
const confirmAddGoal = document.getElementById('confirm-add-goal');

addButton.addEventListener('click', () => {
    if (savingGoalTab.classList.contains('active')) {
        addGoalModal.style.display = 'flex';
    } else {
        addAccountModal.style.display = 'flex';
    }
});

cancelAddAccount.addEventListener('click', () => {
    addAccountModal.style.display = 'none';
});

cancelAddGoal.addEventListener('click', () => {
    addGoalModal.style.display = 'none';
});

let currentUser = null;

// Load current user
async function loadCurrentUser() {
    const email = localStorage.getItem('loggedInUserEmail');
    if (!email) {
        alert('No user logged in. Redirecting to login...');
        window.location.href = 'login.html';
        return;
    }

    const user = await db.users.get({ email });
    if (!user) {
        alert('User not found. Redirecting...');
        window.location.href = 'login.html';
        return;
    }

    currentUser = user;
    await loadAccounts();
    await loadSavings();
}

// Add Account
confirmAddAccount.addEventListener('click', async () => {
    const name = document.getElementById('account-name-input').value;
    const type = document.getElementById('account-type-input').value;
    const amount = parseFloat(document.getElementById('account-balance-input').value);

    if (!name || isNaN(amount)) {
        alert('Please fill in all account fields.');
        return;
    }

    await db.accounts.add({
        userId: currentUser.id,
        name: `${type} (${name})`,
        amount
    });

    addAccountModal.style.display = 'none';
    await loadAccounts();
});

// Add Goal
confirmAddGoal.addEventListener('click', async () => {
    const name = document.getElementById('goal-name-input').value;
    const target = parseFloat(document.getElementById('goal-target-input').value);
    const current = parseFloat(document.getElementById('goal-current-input').value);
    const date = document.getElementById('goal-date-input').value;

    if (!name || isNaN(target) || isNaN(current) || !date) {
        alert('Please fill in all goal fields.');
        return;
    }

    await db.savings.add({
        userId: currentUser.id,
        name,
        target,
        current,
        date
    });

    addGoalModal.style.display = 'none';
    await loadSavings();
});

// Load Accounts (with virtual default)
async function loadAccounts() {
    const list = document.getElementById('accounts-list');
    list.innerHTML = '';

    const accounts = await db.accounts.where({ userId: currentUser.id }).toArray();

    const displayAccounts = accounts.length > 0
        ? accounts
        : [{ name: "No accounts yet", amount: 0, isVirtual: true }];

    displayAccounts.forEach(account => {
        const card = document.createElement('div');
        card.className = 'account-card';
        card.innerHTML = `
            <div class="account-info">
                <div class="account-icon">
                    <i class="fas fa-wallet"></i>
                </div>
                <div class="account-name">${account.name}</div>
            </div>
            <div class="account-balance">R ${account.amount}</div>
            <button class="add-to-account-button" data-id="${account.id}">+</button>
        `;
        if (account.isVirtual) {
            card.style.opacity = 0.6;
            card.style.fontStyle = 'italic';
        }
        list.appendChild(card);
    });
}

// Load Savings (with virtual default handling)
let currentGoalIndex = 0;
let goals = [];

async function loadSavings() {
    goals = await db.savings.where({ userId: currentUser.id }).toArray();
    displayGoal(currentGoalIndex);
}

function displayGoal(index) {
    const goalName = document.querySelector('.goal-name');
    const goalTarget = document.querySelector('.goal-target');
    const progressAmount = document.querySelector('.progress-amount');
    const waterFill = document.getElementById('water-fill');

    if (!goals.length) {
        goalName.textContent = "No goals yet";
        goalTarget.textContent = "R 0";
        progressAmount.textContent = "0";
        if (waterFill) waterFill.style.height = "0%";
        return;
    }

    const goal = goals[index];
    goalName.textContent = goal.name;
    goalTarget.textContent = `R ${goal.target}`;
    progressAmount.textContent = `R ${goal.current}`;

    // Calculate progress as % and update water height
    const progressPercent = Math.min((goal.current / goal.target) * 100, 100);
    if (waterFill) {
        waterFill.style.height = `${progressPercent}%`;
    }


    // arrow
    const progressArrow = document.querySelector('.goal-progress');
    if (progressArrow) {
    progressArrow.style.bottom = `${progressPercent}%`;
    }

}





document.getElementById('prev-goal').addEventListener('click', () => {
    if (!goals.length) return;
    currentGoalIndex = (currentGoalIndex - 1 + goals.length) % goals.length;
    displayGoal(currentGoalIndex);
});

document.getElementById('next-goal').addEventListener('click', () => {
    if (!goals.length) return;
    currentGoalIndex = (currentGoalIndex + 1) % goals.length;
    displayGoal(currentGoalIndex);
});

// // fill bottle
// function updateBottleFill(current, target) {
//     const percent = Math.min((current / target) * 100, 100);
//     const water = document.getElementById('bottle-water');
//     const amount = document.getElementById('progress-amount');

//     water.style.height = `${percent}%`;
//     amount.textContent = current.toLocaleString();
// }

// update the saving goal progress
const editGoalModal = document.getElementById('update-modal');

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('edit-goal-button').addEventListener('click', () => {
        console.log('Edit button clicked');
        editGoalModal.style.display = 'flex';
    });
  
    document.getElementById('cancel-update').addEventListener('click', () => {
        console.log('cancel button clicked');
        editGoalModal.style.display = 'none';
        
    });
  
    document.getElementById('update-goal-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const newAmount = parseFloat(document.getElementById('new-amount').value);
        if (isNaN(newAmount)) return;
  
        const goal = goals[currentGoalIndex];
        goal.current = newAmount;
  
        await db.savings.put(goal);
        displayGoal(currentGoalIndex);
        editGoalModal.style.display = 'none';
    });
  });


  const editAmountModal = document.getElementById('add-to-account-modal');
  const userId = parseInt(localStorage.getItem('loggedInUserId'), 10);
  
  // Handle "+ Add" button click to show modal
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-to-account-button')) {
      const accountId = parseInt(e.target.dataset.id);
      openAddToAccountModal(accountId);
      editAmountModal.style.display = 'flex';
    }
  });
  
  function openAddToAccountModal(accountId) {
    document.getElementById('account-id').value = accountId;
    document.getElementById('add-amount').value = '';
    editAmountModal.classList.remove('hidden');
  }
  
  // Cancel button inside modal
  document.getElementById('cancel-add').addEventListener('click', () => {
    editAmountModal.style.display = 'none';
  });
  
  // Submit form to add amount and save transaction
  document.getElementById('add-to-account-form').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const accountId = parseInt(document.getElementById('account-id').value);
    const amountToAdd = parseFloat(document.getElementById('add-amount').value);
  
    if (isNaN(amountToAdd) || amountToAdd <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
  
    // Get and update account
    const account = await db.accounts.get(accountId);
    if (!account) {
      alert("Account not found.");
      return;
    }
  
    account.amount = (account.amount || 0) + amountToAdd;
    await db.accounts.put(account);
  
    // Log transaction
    await db.transactions.add({
      userId,
      type: 'deposit',
      name: `Added to ${account.name}`,
      amount: amountToAdd,
      date: new Date().toISOString(),
      sourceId: accountId
    });
  
    editAmountModal.style.display = 'none';
    loadAccounts(); // Refresh account list on page
  });
  
  

// Initialize
document.addEventListener('DOMContentLoaded', loadCurrentUser);
