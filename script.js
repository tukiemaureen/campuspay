// --- APP STATE ---
let balance = 250.00; // Initial simulated balance in Kwacha (K)

// Initial mock transactions
let transactions = [
  { id: 1001, title: "Campus Cafeteria", amount: 35.00, type: "Merchant", date: "2026-10-01 08:30" },
  { id: 1002, title: "Sent to STU8821", amount: 15.00, type: "Transfer", date: "2026-09-30 14:15" }
];

// --- INITIAL RENDER ---
document.addEventListener("DOMContentLoaded", () => {
  updateBalanceDisplay();
  renderTransactions();
});

// Navigation function to switch tabs
function showSection(sectionId) {
  const sections = document.querySelectorAll('.page-section');
  sections.forEach(sec => sec.classList.add('hidden'));

  document.getElementById(sectionId).classList.remove('hidden');
}

// Update balance on screen
function updateBalanceDisplay() {
  document.getElementById('user-balance').innerText = balance.toFixed(2);
}

// Render transaction lists (Dashboard & Full History)
function renderTransactions() {
  const dashboardList = document.getElementById('dashboard-recent-list');
  const historyList = document.getElementById('full-history-list');

  dashboardList.innerHTML = '';
  historyList.innerHTML = '';

  if (transactions.length === 0) {
    dashboardList.innerHTML = '<li>No transactions yet.</li>';
    historyList.innerHTML = '<li>No transactions yet.</li>';
    return;
  }

  // Display top 3 on dashboard, all in history tab
  transactions.forEach((tx, index) => {
    const itemHTML = `
      <li class="transaction-item">
        <div>
          <div class="tx-title">${tx.title}</div>
          <div class="tx-date">${tx.date}</div>
        </div>
        <div class="tx-amount">-K${tx.amount.toFixed(2)}</div>
      </li>
    `;

    if (index < 3) dashboardList.innerHTML += itemHTML;
    historyList.innerHTML += itemHTML;
  });
}

// Handle Merchant Payment Submission
function handleMerchantPay(event) {
  event.preventDefault();

  const merchant = document.getElementById('merchant-select').value;
  const amount = parseFloat(document.getElementById('merchant-amount').value);

  if (amount > balance) {
    alert("Insufficient funds! Please enter a lower amount.");
    return;
  }

  // Deduct balance & process
  balance -= amount;
  const newTx = addTransaction(merchant, amount, "Merchant Payment");

  // Reset form
  document.getElementById('merchant-form').reset();

  // Update UI & Show Receipt
  updateBalanceDisplay();
  renderTransactions();
  showReceipt(newTx);
}

// Handle P2P Money Transfer
function handleSendMoney(event) {
  event.preventDefault();

  const recipient = document.getElementById('recipient-id').value;
  const amount = parseFloat(document.getElementById('p2p-amount').value);

  if (amount > balance) {
    alert("Insufficient balance!");
    return;
  }

  // Deduct balance & process
  balance -= amount;
  const title = `Sent to ${recipient}`;
  const newTx = addTransaction(title, amount, "Peer Transfer");

  // Reset form
  document.getElementById('p2p-form').reset();

  // Update UI & Show Receipt
  updateBalanceDisplay();
  renderTransactions();
  showReceipt(newTx);
}

// Helper: Add transaction to array
function addTransaction(title, amount, type) {
  const now = new Date();
  const timestamp = `${now.toISOString().split('T')[0]} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  const refId = Math.floor(10000 + Math.random() * 90000);

  const tx = {
    id: refId,
    title: title,
    amount: amount,
    type: type,
    date: timestamp
  };

  transactions.unshift(tx); // Add to beginning of array
  return tx;
}

// Show Receipt Modal
function showReceipt(tx) {
  document.getElementById('receipt-amount').innerText = tx.amount.toFixed(2);
  document.getElementById('receipt-recipient').innerText = tx.title;
  document.getElementById('receipt-type').innerText = tx.type;
  document.getElementById('receipt-date').innerText = tx.date;
  document.getElementById('receipt-ref').innerText = tx.id;

  document.getElementById('receipt-modal').classList.remove('hidden');
}

// Close Receipt Modal
function closeReceipt() {
  document.getElementById('receipt-modal').classList.add('hidden');
  showSection('dashboard');
}