// LocalStorage Key
const STORAGE_KEY = 'codsoft_expense_tracker_data';

// Application State
let transactions = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// DOM Elements Selection
const totalBalanceEl = document.getElementById('totalBalance');
const totalIncomeEl = document.getElementById('totalIncome');
const totalExpensesEl = document.getElementById('totalExpenses');

const transactionForm = document.getElementById('transactionForm');
const descInput = document.getElementById('descInput');
const amountInput = document.getElementById('amountInput');
const typeSelect = document.getElementById('typeSelect');
const categorySelect = document.getElementById('categorySelect');
const dateInput = document.getElementById('dateInput');
const editIdInput = document.getElementById('editId');
const formTitle = document.getElementById('formTitle');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');

const transactionList = document.getElementById('transactionList');
const filterCategory = document.getElementById('filterCategory');
const emptyState = document.getElementById('emptyState');

// Initialize App Date Input to Today by default
dateInput.valueAsDate = new Date();

// Helper: Format Numbers to INR Currency format
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    }).format(amount);
}

// Save State to LocalStorage
function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

// Calculate and Update Dashboard Financial Summaries
function updateSummary() {
    const incomeTotal = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const expenseTotal = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const balanceTotal = incomeTotal - expenseTotal;

    totalBalanceEl.textContent = formatCurrency(balanceTotal);
    totalIncomeEl.textContent = `+${formatCurrency(incomeTotal)}`;
    totalExpensesEl.textContent = `-${formatCurrency(expenseTotal)}`;

    // Adjust balance color dynamic feedback
    if (balanceTotal < 0) {
        totalBalanceEl.className = 'text-3xl font-extrabold text-rose-500 mt-2';
    } else {
        totalBalanceEl.className = 'text-3xl font-extrabold text-white mt-2';
    }
}

// Render Transactions List with Category Filtering
function renderTransactions() {
    const selectedFilter = filterCategory.value;
    
    const filteredList = transactions.filter(t => {
        if (selectedFilter === 'All') return true;
        return t.category === selectedFilter;
    });

    transactionList.innerHTML = '';

    if (filteredList.length === 0) {
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');

        filteredList.forEach(t => {
            const isIncome = t.type === 'income';
            const borderAccent = isIncome ? 'border-l-emerald-500' : 'border-l-rose-500';
            const amountColor = isIncome ? 'text-emerald-400' : 'text-rose-400';
            const amountPrefix = isIncome ? '+' : '-';

            const card = document.createElement('div');
            card.className = `bg-gray-800 border border-gray-700 border-l-4 ${borderAccent} p-4 rounded-xl flex items-center justify-between shadow-md hover:bg-gray-800/80 transition animate-fade-in`;

            card.innerHTML = `
                <div class="space-y-1 max-w-[60%]">
                    <div class="flex items-center gap-2">
                        <h4 class="font-bold text-white text-sm truncate">${t.description}</h4>
                        <span class="text-[10px] bg-gray-900 text-gray-400 px-2 py-0.5 rounded-full border border-gray-700">${t.category}</span>
                    </div>
                    <p class="text-xs text-gray-400">${t.date}</p>
                </div>
                
                <div class="flex items-center gap-4">
                    <span class="text-base font-extrabold ${amountColor}">
                        ${amountPrefix}${formatCurrency(t.amount)}
                    </span>
                    <div class="flex items-center gap-1">
                        <button onclick="editTransaction('${t.id}')" class="p-1.5 text-gray-400 hover:text-emerald-400 hover:bg-gray-900 rounded-md transition" title="Edit">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                        </button>
                        <button onclick="deleteTransaction('${t.id}')" class="p-1.5 text-gray-400 hover:text-rose-400 hover:bg-gray-900 rounded-md transition" title="Delete">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                    </div>
                </div>
            `;

            transactionList.appendChild(card);
        });
    }

    updateSummary();
}

// Add or Update Transaction Submission
transactionForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const description = descInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const type = typeSelect.value;
    const category = categorySelect.value;
    const date = dateInput.value;
    const editId = editIdInput.value;

    if (!description || isNaN(amount) || amount <= 0 || !date) return;

    if (editId) {
        // Edit Mode
        transactions = transactions.map(t => {
            if (t.id === editId) {
                return { id: editId, description, amount, type, category, date };
            }
            return t;
        });
        resetFormState();
    } else {
        // Add Mode
        const newTransaction = {
            id: Date.now().toString(),
            description,
            amount,
            type,
            category,
            date
        };
        transactions.unshift(newTransaction);
    }

    saveState();
    renderTransactions();
    transactionForm.reset();
    dateInput.valueAsDate = new Date();
});

// Edit Mode Handler
window.editTransaction = function(id) {
    const target = transactions.find(t => t.id === id);
    if (!target) return;

    descInput.value = target.description;
    amountInput.value = target.amount;
    typeSelect.value = target.type;
    categorySelect.value = target.category;
    dateInput.value = target.date;
    editIdInput.value = target.id;

    formTitle.textContent = 'Edit Transaction';
    submitBtn.textContent = 'Update Item';
    cancelBtn.classList.remove('hidden');

    window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Reset Form Edit State
function resetFormState() {
    editIdInput.value = '';
    formTitle.textContent = 'Add New Transaction';
    submitBtn.textContent = 'Add Transaction';
    cancelBtn.classList.add('hidden');
    transactionForm.reset();
    dateInput.valueAsDate = new Date();
}

cancelBtn.addEventListener('click', resetFormState);

// Delete Transaction
window.deleteTransaction = function(id) {
    if (confirm('Are you sure you want to delete this transaction record?')) {
        transactions = transactions.filter(t => t.id !== id);
        saveState();
        renderTransactions();
        if (editIdInput.value === id) {
            resetFormState();
        }
    }
};

// Filter Change Event Listener
filterCategory.addEventListener('change', renderTransactions);

// Initial Application Render
renderTransactions();