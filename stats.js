
import { db } from './database.js';
import Chart from './node_modules/chart.js/dist/chart.js';

const userId = parseInt(localStorage.getItem('loggedInUserId'), 10);
if (!userId) {
  alert("User not logged in. Redirecting...");
  window.location.href = "login.html";
}

const chartCanvas = document.getElementById("expense-chart");
const topSpendingContainer = document.querySelector(".top-spending");
const filterDropdown = document.querySelector(".dropdown span");
const periodTabs = document.querySelectorAll(".period-tab");

let currentFilter = 'Expense';
let currentPeriod = 'Day';
let expenseChart;

// Utilities
const getStartDate = (period) => {
  const now = new Date();
  switch (period) {
    case 'Day': return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    case 'Week': return new Date(now.setDate(now.getDate() - 7));
    case 'Month': return new Date(now.setMonth(now.getMonth() - 1));
    case 'Year': return new Date(now.setFullYear(now.getFullYear() - 1));
  }
};

const formatDate = (date) => new Date(date).toLocaleDateString('en-ZA', {
  year: 'numeric', month: 'short', day: 'numeric'
});

async function getData() {
  const startDate = getStartDate(currentPeriod);
  let data = [];

  if (currentFilter === 'Expense') {
    data = await db.finances.where('userId').equals(userId).and(f => new Date(f.date) >= startDate).toArray();
  } else if (currentFilter === 'Income') {
    data = await db.income.where('userId').equals(userId).and(i => new Date(i.date) >= startDate).toArray();
  } else if (currentFilter === 'Savings') {
    data = await db.savings.where('userId').equals(userId).and(s => new Date(s.date) >= startDate).toArray();
  }

  return data;
}

function groupData(data) {
  const grouped = {};
  data.forEach(entry => {
    const dateKey = new Date(entry.date).toDateString();
    if (!grouped[dateKey]) grouped[dateKey] = 0;
    grouped[dateKey] += parseFloat(entry.amount);
  });
  return Object.entries(grouped).sort((a, b) => new Date(a[0]) - new Date(b[0]));
}

function renderChart(groupedData) {
  const labels = groupedData.map(([date]) => date);
  const amounts = groupedData.map(([, amount]) => amount);

  if (expenseChart) expenseChart.destroy();

  expenseChart = new Chart(chartCanvas, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: `${currentFilter} over Time`,
        data: amounts,
        borderColor: '#36A2EB',
        fill: false
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } }
    }
  });
}

function renderTopSpending(data) {
  const sorted = data.sort((a, b) => b.amount - a.amount).slice(0, 5);
  const container = document.querySelector(".top-spending");

  // Remove all existing dynamic spending items
  container.querySelectorAll(".spending-item").forEach(item => item.remove());

  sorted.forEach(item => {
    const spendingItem = document.createElement("div");
    spendingItem.className = "spending-item";
    spendingItem.innerHTML = `
      <div class="spending-info">
        <div class="spending-logo gradient-bg"><i class="fas fa-coins"></i></div>
        <div class="spending-details">
          <div class="spending-name">${item.category || item.name}</div>
          <div class="spending-date">${formatDate(item.date)}</div>
        </div>
      </div>
      <div class="spending-amount">${currentFilter === 'Income' ? '+' : '-'} R ${parseFloat(item.amount).toFixed(2)}</div>
    `;
    container.appendChild(spendingItem);
  });
}

async function updateStats() {
  const rawData = await getData();
  const grouped = groupData(rawData);
  renderChart(grouped);
  renderTopSpending(rawData);
}

// Period switcher
periodTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelector(".period-tab.active")?.classList.remove("active");
    tab.classList.add("active");
    currentPeriod = tab.textContent.trim();
    updateStats();
  });
});

// Dropdown filter switcher
filterDropdown.parentElement.addEventListener("click", () => {
  const options = ['Expense', 'Income', 'Savings'];
  const next = options[(options.indexOf(currentFilter) + 1) % options.length];
  currentFilter = next;
  filterDropdown.textContent = next;
  updateStats();
});

// Init
updateStats();
