/**
 * SisaBerapa? 💸 — Catatan Keuangan Mahasiswa Anti-Bokek
 * Logic, State Management, Lucide Icons & Micro-Interactions
 */

// =============================================================================
// Constants & Configuration
// =============================================================================

const STORAGE_KEY = 'sisaberapa_keuangan_mahasiswa_v1';
const THEME_STORAGE_KEY = 'sisaberapa_theme';

// Kategori Mahasiswa dengan Ikon Lucide & Warna
const CATEGORIES = {
  expense: [
    { id: 'makan', label: 'Makan & Minum Warteg/Kantin', lucideIcon: 'utensils', color: '#f97316' },
    { id: 'kos', label: 'Bayar Kosan & Listrik', lucideIcon: 'home', color: '#8b5cf6' },
    { id: 'kuliah', label: 'Fotokopi, Diktat & Buku', lucideIcon: 'book-open', color: '#3b82f6' },
    { id: 'nongkrong', label: 'Kopi Nugas & Nongkrong', lucideIcon: 'coffee', color: '#ec4899' },
    { id: 'transport', label: 'Bensin Motor, KRL & Ojol', lucideIcon: 'bike', color: '#06b6d4' },
    { id: 'internet', label: 'Paket Data & Wifi Kos', lucideIcon: 'wifi', color: '#a855f7' },
    { id: 'pribadi', label: 'Laundry & Kebutuhan Kos', lucideIcon: 'shopping-bag', color: '#14b8a6' },
    { id: 'kesehatan', label: 'Obat, Tolak Angin & Vitamin', lucideIcon: 'pill', color: '#ef4444' },
    { id: 'lainnya_keluar', label: 'Jajan / Pengeluaran Lainnya', lucideIcon: 'tag', color: '#64748b' }
  ],
  income: [
    { id: 'ortu', label: 'Uang Saku / Kiriman Ortu', lucideIcon: 'wallet', color: '#10b981' },
    { id: 'beasiswa', label: 'Pencairan Beasiswa Kampus', lucideIcon: 'graduation-cap', color: '#38bdf8' },
    { id: 'freelance', label: 'Gaji Freelance / Side-Job', lucideIcon: 'laptop', color: '#8b5cf6' },
    { id: 'asisten', label: 'Honor Asisten Lab / Dosen', lucideIcon: 'flask-conical', color: '#6366f1' },
    { id: 'bisnis', label: 'Jastip & Jualan Mahasiswa', lucideIcon: 'store', color: '#f59e0b' },
    { id: 'lomba', label: 'Hadiah Lomba / Hibah PKM', lucideIcon: 'award', color: '#eab308' },
    { id: 'lainnya_masuk', label: 'Duit Masuk Lainnya', lucideIcon: 'coins', color: '#14b8a6' }
  ]
};

// Quotes & Tips Keuangan Santai Khas Mahasiswa
const STUDENT_QUOTES = [
  "Makan di warteg boleh barbar, tapi sisihin dana darurat biar akhir bulan gak makan mie tiap hari!",
  "Catat tiap beli es teh manis & fotokopi diktat. Bocor alus 5 ribuan bisa bikin kaget pas cek saldo!",
  "Manfaatin wifi kampus dan perpustakaan buat ngirit kuota internet pas ngerjain tugas laporan.",
  "Aturan simpel: Begitu dapet transferan ortu, langsung bayar kosan dulu sebelum khilaf nongkrong.",
  "Beli deterjen dan galon bareng temen sekamar biar dapet harga grosir lebih hemat."
];

// Helper Date Offset
function getFormattedDateOffset(offsetDays) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
}

// 3 Sampel Data Bawaan Mahasiswa (1 Pemasukan + 2 Pengeluaran)
const SAMPLE_TRANSACTIONS = [
  {
    id: 'tx-1',
    type: 'income',
    category: 'ortu',
    amount: 1500000,
    description: 'Kiriman Uang Saku Bulanan dari Ortu',
    date: getFormattedDateOffset(-3),
    createdAt: Date.now() - 259200000
  },
  {
    id: 'tx-2',
    type: 'expense',
    category: 'kos',
    amount: 650000,
    description: 'Bayar Kamar Kosan Bulan Ini',
    date: getFormattedDateOffset(-2),
    createdAt: Date.now() - 172800000
  },
  {
    id: 'tx-3',
    type: 'expense',
    category: 'makan',
    amount: 22000,
    description: 'Ayam Geprek Sambal Bawang + Es Teh Jumbo',
    date: getFormattedDateOffset(0),
    createdAt: Date.now() - 36000000
  }
];

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

// Helper to safely trigger Lucide Icons creation
function refreshIcons() {
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
}

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
  refreshIcons();
});

// Format hari & tanggal dalam Bahasa Indonesia
function initDateDisplay() {
  const now = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  currentDateDisplay.textContent = now.toLocaleDateString('id-ID', options);
}

// Random tips mahasiswa
function renderRandomQuote() {
  const randomIndex = Math.floor(Math.random() * STUDENT_QUOTES.length);
  studentQuote.textContent = `"${STUDENT_QUOTES[randomIndex]}"`;
}

// Theme handling (dark Slate / light)
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
    showToast('Beralih ke Dark Mode Slate 🌙', 'info');
  } else {
    document.body.classList.remove('dark-theme');
    document.body.classList.add('light-theme');
    localStorage.setItem(THEME_STORAGE_KEY, 'light');
    showToast('Beralih ke Light Mode ☀️', 'info');
  }
  refreshIcons();
}

// =============================================================================
// LocalStorage Management
// =============================================================================

function loadData() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        transactions = parsed;
      } else {
        transactions = [...SAMPLE_TRANSACTIONS];
        saveData();
      }
    } catch (e) {
      console.error('Failed to parse stored transactions:', e);
      transactions = [...SAMPLE_TRANSACTIONS];
    }
  } else {
    // Pengguna pertama kali buka, masukkan tepat 3 data sampel bawaan mahasiswa
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
  const cleanStr = value.toString().replace(/[^0-9]/g, '');
  return cleanStr ? parseInt(cleanStr, 10) : 0;
}

// Format input secara dinamis saat diketik
function handleAmountInputFormatting(e) {
  const rawNum = parseCurrencyInput(e.target.value);
  if (rawNum === 0) {
    e.target.value = '';
  } else {
    e.target.value = new Intl.NumberFormat('id-ID').format(rawNum);
  }
}

// Format tanggal ramah Indonesia: '1 Okt 2026'
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

// Informasi kategori
function getCategoryInfo(type, catId) {
  const list = CATEGORIES[type] || [];
  const found = list.find(c => c.id === catId);
  if (found) return found;
  return { id: catId, label: 'Lainnya', lucideIcon: 'tag', color: '#64748b' };
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
    option.textContent = item.label;
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

  // Render teks angka
  totalBalanceDisplay.textContent = formatRupiah(totalBalance);
  totalIncomeDisplay.textContent = formatRupiah(totalIncome);
  totalExpenseDisplay.textContent = formatRupiah(totalExpense);

  incomeCountBadge.textContent = `${incomeCount} Pemasukan`;

  // Status indikator dompet mahasiswa
  if (totalBalance < 0) {
    balanceStatusBadge.textContent = 'Defisit / Boncos Banget! 🚨';
    balanceStatusBadge.className = 'status-indicator danger';
  } else if (totalBalance < 150000 && totalIncome > 0) {
    balanceStatusBadge.textContent = 'Siaga 1: Saldo Kritis ⚠️';
    balanceStatusBadge.className = 'status-indicator warning';
  } else {
    balanceStatusBadge.textContent = 'Dompet Masih Sehat 😎';
    balanceStatusBadge.className = 'status-indicator';
  }

  // Budget progress meter
  let expenseRatio = 0;
  if (totalIncome > 0) {
    expenseRatio = Math.round((totalExpense / totalIncome) * 100);
  } else if (totalExpense > 0) {
    expenseRatio = 100;
  }

  expenseRatioBadge.textContent = `${expenseRatio}% kepake`;
  budgetPercentageText.textContent = `${expenseRatio}%`;
  budgetBarFill.style.width = `${Math.min(expenseRatio, 100)}%`;

  if (expenseRatio >= 90) {
    budgetStatusText.textContent = 'Waduh! Duit saku udah ludes lebih dari 90%, ngerem jajan ya!';
    budgetBarFill.style.background = 'linear-gradient(90deg, #f59e0b, #ef4444)';
  } else if (expenseRatio >= 70) {
    budgetStatusText.textContent = 'Perhatian! Udah kepake 70% lebih, jangan kalap ngopi!';
    budgetBarFill.style.background = 'linear-gradient(90deg, #8b5cf6, #f59e0b)';
  } else {
    budgetStatusText.textContent = 'Aman terkendali, santai dulu gak sih! Masih banyak cadangan.';
    budgetBarFill.style.background = 'linear-gradient(90deg, #10b981, #8b5cf6)';
  }

  // Hitung Jatah Belanja Aman Hari Ini
  calculateDailySafeBudget(totalBalance);

  // Ringkasan Pos Pengeluaran Terbanyak
  updateTopCategoriesSummary();
}

function calculateDailySafeBudget(totalBalance) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
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
    .slice(0, 3);

  topCategoriesContainer.innerHTML = '';

  if (sortedCategories.length === 0) {
    topCategoriesContainer.innerHTML = `<span class="breakdown-tag">Belum ada pengeluaran yang dicatat</span>`;
    return;
  }

  sortedCategories.forEach(catId => {
    const catInfo = getCategoryInfo('expense', catId);
    const amount = categoryTotals[catId];
    const tag = document.createElement('div');
    tag.className = 'breakdown-tag';
    tag.innerHTML = `
      <i data-lucide="${catInfo.lucideIcon}"></i>
      <span>${catInfo.label.split('/')[0].trim()}:</span>
      <b>${formatRupiah(amount)}</b>
    `;
    topCategoriesContainer.appendChild(tag);
  });
}

// =============================================================================
// Rendering Transactions List
// =============================================================================

function renderApp() {
  updateDashboardOverview();
  renderTransactionsList();
  refreshIcons();
}

function getFilteredTransactions() {
  let list = [...transactions];

  // 1. Filter Jenis Transaksi
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

  transactionSummaryCount.textContent = `${list.length} dari ${transactions.length} catatan tersimpan`;

  if (list.length === 0) {
    emptyState.classList.remove('hidden');
    if (searchQuery || activeFilter !== 'all') {
      document.getElementById('emptyTitle').textContent = 'Gak Ketemu, Bestie!';
      document.getElementById('emptyDesc').textContent = 'Coba cari kata kunci lain atau ubah filter kategorinya ya.';
    } else {
      document.getElementById('emptyTitle').textContent = 'Masih Sepi Nih, Bestie!';
      document.getElementById('emptyDesc').textContent = 'Yuk catat jajan atau kiriman ortu pertama kamu pake form di samping.';
    }
    refreshIcons();
    return;
  }

  emptyState.classList.add('hidden');

  list.forEach(tx => {
    const itemEl = createTransactionElement(tx);
    transactionsContainer.appendChild(itemEl);
  });

  refreshIcons();
}

function createTransactionElement(tx) {
  const isIncome = tx.type === 'income';
  const cat = getCategoryInfo(tx.type, tx.category);

  const item = document.createElement('div');
  item.className = 'transaction-item';
  item.dataset.id = tx.id;

  item.innerHTML = `
    <div class="item-left">
      <div class="item-icon-wrapper" style="background: ${cat.color}20; color: ${cat.color}; border-color: ${cat.color}40;">
        <i data-lucide="${cat.lucideIcon}"></i>
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
          <i data-lucide="edit-3"></i>
        </button>
        <button type="button" class="btn-item-action delete" title="Hapus Transaksi" aria-label="Hapus Transaksi" data-action="delete" data-id="${tx.id}">
          <i data-lucide="trash-2"></i>
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

// Utility to escape HTML
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
      
      // Update placeholder dynamically based on type
      if (selectedType === 'income') {
        descriptionInput.placeholder = 'Dapet duit dari mana nih? (contoh: Uang saku, gaji freelance)';
      } else {
        descriptionInput.placeholder = 'Abis jajan apa hari ini?';
      }
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

  // Validasi ramah mahasiswa
  if (rawAmount <= 0) {
    showToast('Eits, nominalnya gak boleh nol atau kosong dong! 💸', 'error');
    amountInput.focus();
    return;
  }

  if (!description) {
    showToast('Keterangannya diisi dulu ya, biar gak lupa abis jajan apa! 📝', 'error');
    descriptionInput.focus();
    return;
  }

  if (!dateValue) {
    showToast('Pilih tanggal transaksinya dulu ya!', 'error');
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
      showToast('Sip! Catatan transaksi udah di-update 👍', 'success');
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
    showToast('Mantap! Catatan baru udah berhasil disimpan ✨', 'success');
    resetForm();
  }
}

function handleStartEdit(id) {
  const tx = transactions.find(t => t.id === id);
  if (!tx) return;

  transactionForm.scrollIntoView({ behavior: 'smooth', block: 'center' });

  editTransactionId.value = tx.id;
  formTitle.textContent = 'Edit Catatan Transaksi ✏️';
  submitBtnText.textContent = 'Perbarui Catatan 👍';
  cancelEditBtn.classList.remove('hidden');

  const targetRadio = document.querySelector(`input[name="transactionType"][value="${tx.type}"]`);
  if (targetRadio) {
    targetRadio.checked = true;
    updateTypeRadioStyles(tx.type);
    populateCategorySelect(tx.type, tx.category);
  }

  amountInput.value = new Intl.NumberFormat('id-ID').format(tx.amount);
  descriptionInput.value = tx.description;
  dateInput.value = tx.date;

  amountInput.focus();
  refreshIcons();
  showToast('Mode edit aktif, sesuaikan nominal atau keterangannya ya', 'info');
}

function handleCancelEdit() {
  resetForm();
  showToast('Pengeditan catatan dibatalkan', 'info');
}

function resetForm() {
  transactionForm.reset();
  editTransactionId.value = '';
  formTitle.textContent = 'Catat Jajan / Duit Masuk ✍️';
  submitBtnText.textContent = 'Simpan Catatan ✨';
  cancelEditBtn.classList.add('hidden');

  // Reset back to expense by default
  const expenseRadio = document.querySelector('input[name="transactionType"][value="expense"]');
  expenseRadio.checked = true;
  updateTypeRadioStyles('expense');
  populateCategorySelect('expense');
  descriptionInput.placeholder = 'Abis jajan apa hari ini?';

  // Reset date to today
  dateInput.value = new Date().toISOString().split('T')[0];
  amountInput.value = '';
  refreshIcons();
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
  refreshIcons();
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
  showToast('Catatan berhasil dihapus, bestie! 🗑️', 'success');

  if (editTransactionId.value === transactionToDeleteId) {
    resetForm();
  }
}

// =============================================================================
// Reset Data & Export CSV
// =============================================================================

function handleResetData() {
  const confirmAction = confirm(
    "Mau balikin ke 3 data contoh bawaan mahasiswa?\n" +
    "- Klik OK untuk memuat 3 sampel transaksi awal.\n" +
    "- Klik BATAL untuk mempertahankan catatanmu."
  );

  if (confirmAction) {
    transactions = [...SAMPLE_TRANSACTIONS];
    saveData();
    resetForm();
    renderApp();
    showToast('Data contoh mahasiswa berhasil dimuat ulang! 🚀', 'success');
  }
}

function exportToCSV() {
  if (transactions.length === 0) {
    showToast('Belum ada catatan untuk diekspor, bestie!', 'error');
    return;
  }

  const headers = ['ID', 'Tanggal', 'Jenis', 'Kategori', 'Keterangan', 'Nominal (Rp)'];
  const rows = transactions.map(t => {
    const catInfo = getCategoryInfo(t.type, t.category);
    const typeLabel = t.type === 'income' ? 'Duit Masuk' : 'Duit Keluar';
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
  link.setAttribute('download', `sisaberapa_keuangan_mahasiswa_${nowStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  showToast('File CSV berhasil diunduh, siap dicek di Excel! 📊', 'success');
}

// =============================================================================
// Toast Notification (Pojok Kanan Atas, Otomatis Hilang 3 Detik)
// =============================================================================

function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  let iconName = 'info';
  let iconColor = '#8b5cf6';
  if (type === 'success') {
    iconName = 'check-circle';
    iconColor = '#10b981';
  } else if (type === 'error') {
    iconName = 'alert-circle';
    iconColor = '#f43f5e';
  }

  toast.innerHTML = `
    <i data-lucide="${iconName}" style="color: ${iconColor};"></i>
    <span>${escapeHtml(message)}</span>
  `;

  toastContainer.appendChild(toast);
  refreshIcons();

  // Otomatis hilang dalam 3 detik
  setTimeout(() => {
    if (toast.parentNode === toastContainer) {
      toastContainer.removeChild(toast);
    }
  }, 3000);
}
