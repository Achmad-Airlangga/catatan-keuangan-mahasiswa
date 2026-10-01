/**
 * DompetKampus - Aplikasi Catatan Keuangan Mahasiswa
 * Logic, State Management, Local Storage, & DOM Handling
 */

// =============================================================================
// Constants & Configuration
// =============================================================================

const STORAGE_KEY = 'dompet_kampus_data_v1';
const THEME_STORAGE_KEY = 'dompet_kampus_theme';

// Kategori Mahasiswa dengan Ikon & Warna
const CATEGORIES = {
  expense: [
    { id: 'makan', label: 'Makanan & Minuman', icon: '🍲', color: '#f97316' },
    { id: 'kos', label: 'Kos & Tempat Tinggal', icon: '🏠', color: '#6366f1' },
    { id: 'kuliah', label: 'Kebutuhan Kuliah & Buku', icon: '📚', color: '#3b82f6' },
    { id: 'transport', label: 'Transportasi & Bensin', icon: '🛵', color: '#06b6d4' },
    { id: 'internet', label: 'Pulsa & Internet Nugas', icon: '📶', color: '#8b5cf6' },
    { id: 'nongkrong', label: 'Hiburan & Nongkrong', icon: '☕', color: '#ec4899' },
    { id: 'pribadi', label: 'Belanja & Laundry', icon: '🛍️', color: '#14b8a6' },
    { id: 'kesehatan', label: 'Kesehatan & Obat', icon: '💊', color: '#ef4444' },
    { id: 'lainnya_keluar', label: 'Pengeluaran Lainnya', icon: '📦', color: '#64748b' }
  ],
  income: [
    { id: 'ortu', label: 'Uang Saku / Kiriman Ortu', icon: '💸', color: '#10b981' },
    { id: 'beasiswa', label: 'Beasiswa Kuliah', icon: '🎓', color: '#38bdf8' },
    { id: 'freelance', label: 'Gaji Freelance / Side Job', icon: '💻', color: '#8b5cf6' },
    { id: 'asisten', label: 'Honor Asisten Lab / Dosen', icon: '🔬', color: '#6366f1' },
    { id: 'bisnis', label: 'Jastip / Jualan Mahasiswa', icon: '🤝', color: '#f59e0b' },
    { id: 'lomba', label: 'Hadiah Lomba / Hibah', icon: '🏆', color: '#eab308' },
    { id: 'lainnya_masuk', label: 'Pemasukan Lainnya', icon: '💰', color: '#14b8a6' }
  ]
};

// Quotes & Tips Keuangan Mahasiswa
const STUDENT_QUOTES = [
  "Makan teratur di warteg boleh, tapi sisihkan tabungan darurat sebelum akhir bulan!",
  "Catat setiap fotokopi dan beli bensin. Pengeluaran kecil yang bocor halus bisa bikin dompet kempes!",
  "Gunakan fasilitas wifi kampus dan perpustakaan untuk menghemat kuota internet serta buku.",
  "Aturan 50/30/20: 50% kebutuhan pokok, 30% tabungan/investasi, 20% nongkrong & hobi.",
  "Belanja kebutuhan kos sekaligus dalam ukuran besar bersama teman kos untuk harga grosir lebih hemat."
];

// Data Awal Contoh (Realistic Student Data)
const SAMPLE_TRANSACTIONS = [
  {
    id: 'tx-1',
    type: 'income',
    category: 'ortu',
    amount: 1800000,
    description: 'Kiriman Uang Saku Bulanan dari Ortu',
    date: getFormattedDateOffset(-4),
    createdAt: Date.now() - 345600000
  },
  {
    id: 'tx-2',
    type: 'expense',
    category: 'kos',
    amount: 650000,
    description: 'Sewa Kamar Kos + Listrik',
    date: getFormattedDateOffset(-3),
    createdAt: Date.now() - 259200000
  },
  {
    id: 'tx-3',
    type: 'income',
    category: 'asisten',
    amount: 350000,
    description: 'Honor Asisten Praktikum Algoritma',
    date: getFormattedDateOffset(-2),
    createdAt: Date.now() - 172800000
  },
  {
    id: 'tx-4',
    type: 'expense',
    category: 'internet',
    amount: 65000,
    description: 'Paket Data Nugas 30GB',
    date: getFormattedDateOffset(-2),
    createdAt: Date.now() - 170000000
  },
  {
    id: 'tx-5',
    type: 'expense',
    category: 'kuliah',
    amount: 35000,
    description: 'Fotokopi Diktat Kuliah & Print Laporan',
    date: getFormattedDateOffset(-1),
    createdAt: Date.now() - 86400000
  },
  {
    id: 'tx-6',
    type: 'expense',
    category: 'makan',
    amount: 18000,
    description: 'Makan Siang Nasi Warteg Berkah',
    date: getFormattedDateOffset(0),
    createdAt: Date.now() - 36000000
  },
  {
    id: 'tx-7',
    type: 'expense',
    category: 'nongkrong',
    amount: 25000,
    description: 'Kopi Susu nugas bareng tim kelompok',
    date: getFormattedDateOffset(0),
    createdAt: Date.now() - 12000000
  }
];

// Helper Date Offset
function getFormattedDateOffset(offsetDays) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
}

// =============================================================================
// App State
// =============================================================================

let transactions = [];
let activeFilter = 'all'; // 'all' | 'expense' | 'income'
let searchQuery = '';
let currentSort = 'date-desc';
let transactionToDeleteId = null;

// =============================================================================
// DOM Selectors
// =============================================================================

const totalBalanceDisplay = document.getElementById('totalBalanceDisplay');
const totalIncomeDisplay = document.getElementById('totalIncomeDisplay');
const totalExpenseDisplay = document.getElementById('totalExpenseDisplay');
const balanceStatusBadge = document.getElementById('balanceStatusBadge');
const incomeCountBadge = document.getElementById('incomeCountBadge');
const expenseRatioBadge = document.getElementById('expenseRatioBadge');
const dailyBudgetDisplay = document.getElementById('dailyBudgetDisplay');
const currentDateDisplay = document.getElementById('currentDateDisplay');
const studentQuote = document.getElementById('studentQuote');

const budgetStatusText = document.getElementById('budgetStatusText');
const budgetPercentageText = document.getElementById('budgetPercentageText');
const budgetBarFill = document.getElementById('budgetBarFill');

const transactionForm = document.getElementById('transactionForm');
const formTitle = document.getElementById('formTitle');
const editTransactionId = document.getElementById('editTransactionId');
const amountInput = document.getElementById('amountInput');
const categorySelect = document.getElementById('categorySelect');
const descriptionInput = document.getElementById('descriptionInput');
const dateInput = document.getElementById('dateInput');
const submitBtnText = document.getElementById('submitBtnText');
const cancelEditBtn = document.getElementById('cancelEditBtn');

const transactionsContainer = document.getElementById('transactionsContainer');
const emptyState = document.getElementById('emptyState');
const transactionSummaryCount = document.getElementById('transactionSummaryCount');
const topCategoriesContainer = document.getElementById('topCategoriesContainer');
const searchInput = document.getElementById('searchInput');
const clearSearchBtn = document.getElementById('clearSearchBtn');
const sortSelect = document.getElementById('sortSelect');
const filterPillsContainer = document.getElementById('filterPillsContainer');

const themeToggleBtn = document.getElementById('themeToggleBtn');
const exportBtn = document.getElementById('exportBtn');
const resetDataBtn = document.getElementById('resetDataBtn');
const toastContainer = document.getElementById('toastContainer');

const confirmModal = document.getElementById('confirmModal');
const modalCancelBtn = document.getElementById('modalCancelBtn');
const modalConfirmBtn = document.getElementById('modalConfirmBtn');

// =============================================================================
// Initialization
// =============================================================================

document.addEventListener('DOMContentLoaded', () => {
  initDateDisplay();
  initTheme();
  loadData();
  populateCategorySelect('expense'); // Default is expense
  dateInput.value = new Date().toISOString().split('T')[0];
  setupEventListeners();
  renderApp();
  renderRandomQuote();
});

// Format today's date in Indonesian
function initDateDisplay() {
  const now = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  currentDateDisplay.textContent = now.toLocaleDateString('id-ID', options);
}

// Random financial tips
function renderRandomQuote() {
  const randomIndex = Math.floor(Math.random() * STUDENT_QUOTES.length);
  studentQuote.textContent = `"${STUDENT_QUOTES[randomIndex]}"`;
}

// Theme handling (dark / light)
function initTheme() {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme === 'light') {
    document.body.classList.remove('dark-theme');
    document.body.classList.add('light-theme');
  } else {
    document.body.classList.remove('light-theme');
    document.body.classList.add('dark-theme');
  }
}

function toggleTheme() {
  const isLight = document.body.classList.contains('light-theme');
  if (isLight) {
    document.body.classList.remove('light-theme');
    document.body.classList.add('dark-theme');
    localStorage.setItem(THEME_STORAGE_KEY, 'dark');
    showToast('Beralih ke Mode Gelap', 'info');
  } else {
    document.body.classList.remove('dark-theme');
    document.body.classList.add('light-theme');
    localStorage.setItem(THEME_STORAGE_KEY, 'light');
    showToast('Beralih ke Mode Terang', 'info');
  }
}

// =============================================================================
// LocalStorage Management
// =============================================================================

function loadData() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      transactions = JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse stored transactions:', e);
      transactions = [...SAMPLE_TRANSACTIONS];
    }
  } else {
    // First time visitor, load realistic sample data
    transactions = [...SAMPLE_TRANSACTIONS];
    saveData();
  }
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

// =============================================================================
// Helper Functions: Rupiah & Numbers
// =============================================================================

function formatRupiah(number) {
  if (isNaN(number)) return 'Rp 0';
  const isNegative = number < 0;
  const absValue = Math.abs(Math.round(number));
  const formatted = new Intl.NumberFormat('id-ID').format(absValue);
  return `${isNegative ? '- Rp ' : 'Rp '}${formatted}`;
}

function parseCurrencyInput(value) {
  if (!value) return 0;
  // Strip all non-numeric characters
  const cleanStr = value.toString().replace(/[^0-9]/g, '');
  return cleanStr ? parseInt(cleanStr, 10) : 0;
}

// Format input box dynamically as user types
function handleAmountInputFormatting(e) {
  const rawNum = parseCurrencyInput(e.target.value);
  if (rawNum === 0) {
    e.target.value = '';
  } else {
    e.target.value = new Intl.NumberFormat('id-ID').format(rawNum);
  }
}

// Format date to Indonesian readable string: '1 Okt 2026'
function formatIndonesianDate(dateString) {
  if (!dateString) return '-';
  const parts = dateString.split('-');
  if (parts.length !== 3) return dateString;
  const dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
  return dateObj.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

// Find category detail
function getCategoryInfo(type, catId) {
  const list = CATEGORIES[type] || [];
  const found = list.find(c => c.id === catId);
  if (found) return found;
  return { id: catId, label: 'Lainnya', icon: '🔖', color: '#64748b' };
}

// =============================================================================
// Category Select Dropdown Population
// =============================================================================

function populateCategorySelect(type, selectedCategory = '') {
  const catList = CATEGORIES[type] || [];
  categorySelect.innerHTML = '';
  
  catList.forEach(item => {
    const option = document.createElement('option');
    option.value = item.id;
    option.textContent = `${item.icon} ${item.label}`;
    if (selectedCategory && selectedCategory === item.id) {
      option.selected = true;
    }
    categorySelect.appendChild(option);
  });
}

// =============================================================================
// Calculations & Dashboard Overview
// =============================================================================

function updateDashboardOverview() {
  let totalIncome = 0;
  let totalExpense = 0;
  let incomeCount = 0;
  let expenseCount = 0;

  transactions.forEach(t => {
    const val = Number(t.amount) || 0;
    if (t.type === 'income') {
      totalIncome += val;
      incomeCount++;
    } else {
      totalExpense += val;
      expenseCount++;
    }
  });

  const totalBalance = totalIncome - totalExpense;

  // Render text values
  totalBalanceDisplay.textContent = formatRupiah(totalBalance);
  totalIncomeDisplay.textContent = formatRupiah(totalIncome);
  totalExpenseDisplay.textContent = formatRupiah(totalExpense);

  incomeCountBadge.textContent = `${incomeCount} Transaksi`;

  // Balance status indicators
  if (totalBalance < 0) {
    balanceStatusBadge.textContent = 'Saldo Minus / Defisit!';
    balanceStatusBadge.className = 'status-indicator danger';
  } else if (totalBalance < 200000 && totalIncome > 0) {
    balanceStatusBadge.textContent = 'Peringatan: Kritis Menipis';
    balanceStatusBadge.className = 'status-indicator warning';
  } else {
    balanceStatusBadge.textContent = 'Kondisi Saldo Aman';
    balanceStatusBadge.className = 'status-indicator';
  }

  // Budget progress meter
  let expenseRatio = 0;
  if (totalIncome > 0) {
    expenseRatio = Math.round((totalExpense / totalIncome) * 100);
  } else if (totalExpense > 0) {
    expenseRatio = 100;
  }

  expenseRatioBadge.textContent = `${expenseRatio}% terpakai`;
  budgetPercentageText.textContent = `${expenseRatio}%`;
  budgetBarFill.style.width = `${Math.min(expenseRatio, 100)}%`;

  if (expenseRatio >= 90) {
    budgetStatusText.textContent = 'Bahaya! Pengeluaranmu hampir habis / melebihi pemasukan';
    budgetBarFill.style.background = 'linear-gradient(90deg, #f59e0b, #ef4444)';
  } else if (expenseRatio >= 70) {
    budgetStatusText.textContent = 'Perhatian! Sudah lebih dari 70% uang saku terpakai';
    budgetBarFill.style.background = 'linear-gradient(90deg, #10b981, #f59e0b)';
  } else {
    budgetStatusText.textContent = 'Bagus! Pengeluaran masih di bawah kontrol aman';
    budgetBarFill.style.background = 'linear-gradient(90deg, #10b981, #38bdf8)';
  }

  // Calculate Daily Safe Spend for the rest of the month
  calculateDailySafeBudget(totalBalance);

  // Top Expense Categories summary
  updateTopCategoriesSummary();
}

function calculateDailySafeBudget(totalBalance) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  // Total days in current month
  const totalDays = new Date(year, month + 1, 0).getDate();
  const todayDate = now.getDate();
  const remainingDays = Math.max(1, (totalDays - todayDate) + 1);

  if (totalBalance <= 0) {
    dailyBudgetDisplay.textContent = 'Rp 0';
  } else {
    const dailySafe = Math.floor(totalBalance / remainingDays);
    dailyBudgetDisplay.textContent = formatRupiah(dailySafe);
  }
}

function updateTopCategoriesSummary() {
  const categoryTotals = {};
  
  transactions.filter(t => t.type === 'expense').forEach(t => {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + (Number(t.amount) || 0);
  });

  const sortedCategories = Object.keys(categoryTotals)
    .sort((a, b) => categoryTotals[b] - categoryTotals[a])
    .slice(0, 4);

  topCategoriesContainer.innerHTML = '';

  if (sortedCategories.length === 0) {
    topCategoriesContainer.innerHTML = `<span class="breakdown-tag">Belum ada data pengeluaran</span>`;
    return;
  }

  sortedCategories.forEach(catId => {
    const catInfo = getCategoryInfo('expense', catId);
    const amount = categoryTotals[catId];
    const tag = document.createElement('div');
    tag.className = 'breakdown-tag';
    tag.innerHTML = `<span>${catInfo.icon} ${catInfo.label}:</span> <b>${formatRupiah(amount)}</b>`;
    topCategoriesContainer.appendChild(tag);
  });
}

// =============================================================================
// Rendering Transactions List
// =============================================================================

function renderApp() {
  updateDashboardOverview();
  renderTransactionsList();
}

function getFilteredTransactions() {
  let list = [...transactions];

  // 1. Filter Type (all, expense, income)
  if (activeFilter !== 'all') {
    list = list.filter(item => item.type === activeFilter);
  }

  // 2. Search Query
  if (searchQuery.trim() !== '') {
    const q = searchQuery.toLowerCase().trim();
    list = list.filter(item => {
      const desc = (item.description || '').toLowerCase();
      const catInfo = getCategoryInfo(item.type, item.category);
      const catName = (catInfo.label || '').toLowerCase();
      const amountStr = item.amount.toString();
      return desc.includes(q) || catName.includes(q) || amountStr.includes(q);
    });
  }

  // 3. Sort
  list.sort((a, b) => {
    switch (currentSort) {
      case 'date-desc':
        return new Date(b.date).getTime() - new Date(a.date).getTime() || b.createdAt - a.createdAt;
      case 'date-asc':
        return new Date(a.date).getTime() - new Date(b.date).getTime() || a.createdAt - b.createdAt;
      case 'amount-desc':
        return b.amount - a.amount;
      case 'amount-asc':
        return a.amount - b.amount;
      default:
        return b.createdAt - a.createdAt;
    }
  });

  return list;
}

function renderTransactionsList() {
  const list = getFilteredTransactions();
  transactionsContainer.innerHTML = '';

  transactionSummaryCount.textContent = `${list.length} dari ${transactions.length} catatan`;

  if (list.length === 0) {
    emptyState.classList.remove('hidden');
    if (searchQuery || activeFilter !== 'all') {
      document.getElementById('emptyTitle').textContent = 'Tidak Ditemukan';
      document.getElementById('emptyDesc').textContent = 'Coba ubah kata kunci pencarian atau ganti filter kategori.';
    } else {
      document.getElementById('emptyTitle').textContent = 'Belum Ada Transaksi';
      document.getElementById('emptyDesc').textContent = 'Gunakan formulir di samping untuk mulai mencatat keuangan kuliahmu.';
    }
    return;
  }

  emptyState.classList.add('hidden');

  list.forEach(tx => {
    const itemEl = createTransactionElement(tx);
    transactionsContainer.appendChild(itemEl);
  });
}

function createTransactionElement(tx) {
  const isIncome = tx.type === 'income';
  const cat = getCategoryInfo(tx.type, tx.category);

  const item = document.createElement('div');
  item.className = 'transaction-item';
  item.dataset.id = tx.id;

  item.innerHTML = `
    <div class="item-left">
      <div class="item-icon-wrapper" style="background: ${cat.color}20; color: ${cat.color};">
        ${cat.icon}
      </div>
      <div class="item-details">
        <span class="item-description" title="${escapeHtml(tx.description)}">${escapeHtml(tx.description)}</span>
        <div class="item-meta">
          <span class="item-category-tag">${cat.label}</span>
          <span>&bull;</span>
          <span>${formatIndonesianDate(tx.date)}</span>
        </div>
      </div>
    </div>

    <div class="item-right">
      <div class="item-amount-group">
        <span class="item-amount ${isIncome ? 'income' : 'expense'}">
          ${isIncome ? '+' : '-'} ${formatRupiah(tx.amount)}
        </span>
      </div>
      <div class="item-actions">
        <button type="button" class="btn-item-action edit" title="Edit Transaksi" aria-label="Edit Transaksi" data-action="edit" data-id="${tx.id}">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </button>
        <button type="button" class="btn-item-action delete" title="Hapus Transaksi" aria-label="Hapus Transaksi" data-action="delete" data-id="${tx.id}">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>
    </div>
  `;

  // Attach button event handlers
  const editBtn = item.querySelector('[data-action="edit"]');
  editBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    handleStartEdit(tx.id);
  });

  const deleteBtn = item.querySelector('[data-action="delete"]');
  deleteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    promptDelete(tx.id);
  });

  return item;
}

// Utility to escape HTML to prevent XSS
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// =============================================================================
// Form Submission & Editing
// =============================================================================

function setupEventListeners() {
  // Amount input realtime formatting
  amountInput.addEventListener('input', handleAmountInputFormatting);

  // Quick Amount Chips
  document.querySelectorAll('.chip-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const addValue = parseInt(btn.dataset.add, 10);
      const currentVal = parseCurrencyInput(amountInput.value);
      const newVal = currentVal + addValue;
      amountInput.value = new Intl.NumberFormat('id-ID').format(newVal);
      amountInput.focus();
    });
  });

  // Type Radio Buttons (Expense vs Income)
  const typeRadios = document.querySelectorAll('input[name="transactionType"]');
  typeRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      const selectedType = e.target.value;
      updateTypeRadioStyles(selectedType);
      populateCategorySelect(selectedType);
    });
  });

  // Form Submit
  transactionForm.addEventListener('submit', handleFormSubmit);

  // Cancel Edit
  cancelEditBtn.addEventListener('click', handleCancelEdit);

  // Search input
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    if (searchQuery.trim() !== '') {
      clearSearchBtn.classList.remove('hidden');
    } else {
      clearSearchBtn.classList.add('hidden');
    }
    renderTransactionsList();
  });

  clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    searchQuery = '';
    clearSearchBtn.classList.add('hidden');
    searchInput.focus();
    renderTransactionsList();
  });

  // Filter Pills (All, Expense, Income)
  filterPillsContainer.querySelectorAll('.filter-pill').forEach(pill => {
    pill.addEventListener('click', (e) => {
      filterPillsContainer.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
      e.target.classList.add('active');
      activeFilter = e.target.dataset.filter;
      renderTransactionsList();
    });
  });

  // Sort dropdown
  sortSelect.addEventListener('change', (e) => {
    currentSort = e.target.value;
    renderTransactionsList();
  });

  // Theme Toggle
  themeToggleBtn.addEventListener('click', toggleTheme);

  // Export CSV
  exportBtn.addEventListener('click', exportToCSV);

  // Reset Data Button
  resetDataBtn.addEventListener('click', handleResetData);

  // Modal Cancel & Confirm
  modalCancelBtn.addEventListener('click', closeDeleteModal);
  modalConfirmBtn.addEventListener('click', confirmDeleteTransaction);
  confirmModal.addEventListener('click', (e) => {
    if (e.target === confirmModal) {
      closeDeleteModal();
    }
  });

  // Escape key to close modal or cancel edit
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDeleteModal();
      if (editTransactionId.value) {
        handleCancelEdit();
      }
    }
  });
}

function updateTypeRadioStyles(type) {
  const expenseLabel = document.querySelector('.type-expense-label');
  const incomeLabel = document.querySelector('.type-income-label');
  
  if (type === 'expense') {
    expenseLabel.classList.add('active');
    incomeLabel.classList.remove('active');
  } else {
    incomeLabel.classList.add('active');
    expenseLabel.classList.remove('active');
  }
}

function handleFormSubmit(e) {
  e.preventDefault();

  const isEditing = editTransactionId.value.trim() !== '';
  const selectedType = document.querySelector('input[name="transactionType"]:checked').value;
  const rawAmount = parseCurrencyInput(amountInput.value);
  const selectedCategory = categorySelect.value;
  const description = descriptionInput.value.trim();
  const dateValue = dateInput.value;

  // Validation
  if (rawAmount <= 0) {
    showToast('Harap masukkan nominal transaksi yang valid!', 'error');
    amountInput.focus();
    return;
  }

  if (!description) {
    showToast('Harap isi keterangan transaksi!', 'error');
    descriptionInput.focus();
    return;
  }

  if (!dateValue) {
    showToast('Harap pilih tanggal transaksi!', 'error');
    dateInput.focus();
    return;
  }

  if (isEditing) {
    // Update existing transaction
    const targetId = editTransactionId.value;
    const index = transactions.findIndex(t => t.id === targetId);
    if (index !== -1) {
      transactions[index] = {
        ...transactions[index],
        type: selectedType,
        category: selectedCategory,
        amount: rawAmount,
        description: description,
        date: dateValue
      };
      saveData();
      renderApp();
      showToast('Transaksi berhasil diperbarui!', 'success');
      resetForm();
    }
  } else {
    // Add new transaction
    const newTx = {
      id: 'tx-' + Date.now(),
      type: selectedType,
      category: selectedCategory,
      amount: rawAmount,
      description: description,
      date: dateValue,
      createdAt: Date.now()
    };

    transactions.unshift(newTx);
    saveData();
    renderApp();
    showToast('Transaksi baru berhasil dicatat!', 'success');
    resetForm();
  }
}

function handleStartEdit(id) {
  const tx = transactions.find(t => t.id === id);
  if (!tx) return;

  // Scroll to form on mobile/tablet smoothly
  transactionForm.scrollIntoView({ behavior: 'smooth', block: 'center' });

  editTransactionId.value = tx.id;
  formTitle.textContent = 'Edit Transaksi';
  submitBtnText.textContent = 'Perbarui Transaksi';
  cancelEditBtn.classList.remove('hidden');

  // Set type radio
  const targetRadio = document.querySelector(`input[name="transactionType"][value="${tx.type}"]`);
  if (targetRadio) {
    targetRadio.checked = true;
    updateTypeRadioStyles(tx.type);
    populateCategorySelect(tx.type, tx.category);
  }

  // Populate fields
  amountInput.value = new Intl.NumberFormat('id-ID').format(tx.amount);
  descriptionInput.value = tx.description;
  dateInput.value = tx.date;

  amountInput.focus();
  showToast('Mode pengeditan aktif', 'info');
}

function handleCancelEdit() {
  resetForm();
  showToast('Pengeditan dibatalkan', 'info');
}

function resetForm() {
  transactionForm.reset();
  editTransactionId.value = '';
  formTitle.textContent = 'Catat Transaksi Baru';
  submitBtnText.textContent = 'Simpan Transaksi';
  cancelEditBtn.classList.add('hidden');

  // Reset back to expense by default
  const expenseRadio = document.querySelector('input[name="transactionType"][value="expense"]');
  expenseRadio.checked = true;
  updateTypeRadioStyles('expense');
  populateCategorySelect('expense');

  // Reset date to today
  dateInput.value = new Date().toISOString().split('T')[0];
  amountInput.value = '';
}

// =============================================================================
// Delete Confirmation Modal
// =============================================================================

function promptDelete(id) {
  transactionToDeleteId = id;
  const tx = transactions.find(t => t.id === id);
  if (tx) {
    document.getElementById('modalDesc').textContent = `Hapus catatan "${tx.description}" (${formatRupiah(tx.amount)})?`;
  }
  confirmModal.classList.remove('hidden');
}

function closeDeleteModal() {
  transactionToDeleteId = null;
  confirmModal.classList.add('hidden');
}

function confirmDeleteTransaction() {
  if (!transactionToDeleteId) return;

  transactions = transactions.filter(t => t.id !== transactionToDeleteId);
  saveData();
  closeDeleteModal();
  renderApp();
  showToast('Catatan transaksi telah dihapus', 'success');

  // If was editing this item, cancel edit
  if (editTransactionId.value === transactionToDeleteId) {
    resetForm();
  }
}

// =============================================================================
// Reset Data & Export CSV
// =============================================================================

function handleResetData() {
  const confirmAction = confirm(
    "Pilihan Reset Data:\n" +
    "- Klik OK untuk memuat ulang data contoh mahasiswa yang lengkap.\n" +
    "- Klik BATAL untuk membatalkan."
  );

  if (confirmAction) {
    transactions = [...SAMPLE_TRANSACTIONS];
    saveData();
    resetForm();
    renderApp();
    showToast('Data contoh mahasiswa berhasil dimuat ulang!', 'success');
  }
}

function exportToCSV() {
  if (transactions.length === 0) {
    showToast('Belum ada transaksi untuk diekspor', 'error');
    return;
  }

  const headers = ['ID', 'Tanggal', 'Jenis', 'Kategori', 'Keterangan', 'Nominal (Rp)'];
  const rows = transactions.map(t => {
    const catInfo = getCategoryInfo(t.type, t.category);
    const typeLabel = t.type === 'income' ? 'Pemasukan' : 'Pengeluaran';
    const cleanDesc = `"${(t.description || '').replace(/"/g, '""')}"`;
    const cleanCat = `"${(catInfo.label || '').replace(/"/g, '""')}"`;
    return [t.id, t.date, typeLabel, cleanCat, cleanDesc, t.amount].join(',');
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  const nowStr = new Date().toISOString().split('T')[0];
  link.setAttribute('href', url);
  link.setAttribute('download', `catatan_keuangan_mahasiswa_${nowStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  showToast('Catatan berhasil diekspor ke file CSV!', 'success');
}

// =============================================================================
// Toast Notification
// =============================================================================

function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  let iconSvg = '';
  if (type === 'success') {
    iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"></path></svg>`;
  } else if (type === 'error') {
    iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
  } else {
    iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
  }

  toast.innerHTML = `
    ${iconSvg}
    <span>${escapeHtml(message)}</span>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    if (toast.parentNode === toastContainer) {
      toastContainer.removeChild(toast);
    }
  }, 3000);
}
