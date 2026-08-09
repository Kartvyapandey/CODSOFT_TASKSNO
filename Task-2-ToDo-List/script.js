const STORAGE_KEY = 'codsoft_todo_advanced';
let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// DOM Elements
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const categoryInput = document.getElementById('categoryInput');
const priorityInput = document.getElementById('priorityInput');
const dateInput = document.getElementById('dateInput');
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');
const taskCount = document.getElementById('taskCount');
const sortBtn = document.getElementById('sortBtn');

// 🌙 Dark Mode Logic
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const htmlEl = document.documentElement;

// Check saved theme
if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    htmlEl.classList.add('dark');
    updateThemeIcon(true);
} else {
    updateThemeIcon(false);
}

themeToggle.addEventListener('click', () => {
    htmlEl.classList.toggle('dark');
    const isDark = htmlEl.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeIcon(isDark);
});

function updateThemeIcon(isDark) {
    if (isDark) {
        // Sun Icon for Dark Mode
        themeIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>`;
    } else {
        // Moon Icon for Light Mode
        themeIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>`;
    }
}

// 📅 Initialize Date Picker to Today
dateInput.valueAsDate = new Date();

// 💾 Save & Render
function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function getPriorityColor(priority) {
    if (priority === 'High') return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-800';
    if (priority === 'Medium') return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800';
    return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
}

function renderTasks() {
    taskList.innerHTML = '';
    taskCount.textContent = tasks.length;

    if (tasks.length === 0) {
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');

        // Today's date for overdue checking
        const today = new Date().setHours(0, 0, 0, 0);

        tasks.forEach(task => {
            const taskDate = new Date(task.dueDate).setHours(0,0,0,0);
            const isOverdue = taskDate < today && !task.completed;
            const dateColor = isOverdue ? 'text-rose-500 font-bold' : 'text-slate-500 dark:text-slate-400';

            const li = document.createElement('li');
            li.className = `bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl flex items-center justify-between shadow-sm hover:shadow-md transition gap-4 ${task.completed ? 'opacity-70' : ''}`;

            li.innerHTML = `
                <div class="flex items-center gap-4 flex-1">
                    <input type="checkbox" class="custom-checkbox flex-shrink-0" ${task.completed ? 'checked' : ''} onclick="toggleTask('${task.id}')">
                    <div class="flex-1 min-w-0">
                        <p class="font-semibold text-slate-800 dark:text-slate-100 truncate ${task.completed ? 'completed-text' : ''}">${task.text}</p>
                        
                        <div class="flex flex-wrap items-center gap-2 mt-2 text-xs">
                            <span class="${dateColor} flex items-center gap-1">
                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                ${task.dueDate}
                            </span>
                            <span class="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                                ${task.category}
                            </span>
                            <span class="px-2 py-0.5 rounded-md border ${getPriorityColor(task.priority)}">
                                ${task.priority}
                            </span>
                        </div>
                    </div>
                </div>
                
                <button onclick="deleteTask('${task.id}')" class="text-slate-400 hover:text-rose-500 transition p-2 flex-shrink-0">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
            `;
            taskList.appendChild(li);
        });
    }
}

// ✍️ Add Task
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = taskInput.value.trim();
    const category = categoryInput.value;
    const priority = priorityInput.value;
    const dueDate = dateInput.value;

    if (!text || !dueDate) return;

    const newTask = {
        id: Date.now().toString(),
        text,
        category,
        priority,
        dueDate,
        completed: false
    };

    tasks.unshift(newTask);
    saveTasks();
    renderTasks();
    taskInput.value = ''; // Only reset text, keep other preferences
});

// ✅ Toggle Completion
window.toggleTask = function(id) {
    tasks = tasks.map(task => {
        if (task.id === id) return { ...task, completed: !task.completed };
        return task;
    });
    saveTasks();
    renderTasks();
};

// 🗑️ Delete Task
window.deleteTask = function(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
};

// 🔽 Sort Tasks by Due Date
let isSortedAsc = true;
sortBtn.addEventListener('click', () => {
    tasks.sort((a, b) => {
        const dateA = new Date(a.dueDate);
        const dateB = new Date(b.dueDate);
        return isSortedAsc ? dateA - dateB : dateB - dateA;
    });
    
    isSortedAsc = !isSortedAsc;
    sortBtn.textContent = isSortedAsc ? 'Sort by Due Date ↓' : 'Sort by Due Date ↑';
    saveTasks();
    renderTasks();
});

// Initial Render
renderTasks();