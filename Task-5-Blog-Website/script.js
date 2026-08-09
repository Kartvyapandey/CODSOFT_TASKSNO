const STORAGE_KEY = 'codsoft_blog_posts';

// Default Data with empty comments array
const defaultPosts = [
    {
        id: "101",
        author: "Kartvya Pandey",
        image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
        title: "The Future of Frontend Development in 2026",
        content: "Frontend development is evolving at a breakneck speed. With the rise of AI-assisted coding and advanced frameworks, developers are now focusing more on logic and architecture rather than just boilerplate code.\n\nThe key to staying ahead is adaptability. Focus on building modular, clean, and responsive user interfaces that prioritize user experience. Tools like Tailwind CSS and vanilla JavaScript are proving to be timeless in a sea of complex libraries.",
        date: "Aug 9, 2026",
        comments: [{ name: "Alex", text: "Great insights!" }]
    },
    {
        id: "102",
        author: "Alex Morgan",
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
        title: "Why Minimalist UI Design Always Wins",
        content: "Have you ever noticed how the most premium applications—like Apple Music or Medium—use minimal colors and generous whitespace? Minimalist design isn't just about looking good; it's about reducing cognitive load for the user.\n\nBy stripping away unnecessary borders, loud colors, and distracting animations, you guide the user's eye directly to the content that matters. This blog layout itself is an example of prioritizing readability over flashy graphics.",
        date: "Aug 8, 2026",
        comments: []
    },
    {
        id: "103",
        author: "Sarah Chen",
        image: "https://images.unsplash.com/photo-1522199755839-a2bacb67c546?auto=format&fit=crop&w=800&q=80",
        title: "Mastering LocalStorage for Web Apps",
        content: "When building frontend-only applications, LocalStorage is your best friend. It allows you to save stringified JSON data directly in the user's browser, persisting state across page reloads without needing a backend database.\n\nWhile it has a 5MB storage limit, it is absolutely perfect for saving user preferences, to-do lists, expense trackers, and even draft blog posts. Just remember to parse your JSON when retrieving it from the browser!",
        date: "Aug 5, 2026",
        comments: []
    }
];

let posts = JSON.parse(localStorage.getItem(STORAGE_KEY));
if (!posts || posts.length === 0) {
    posts = defaultPosts;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

// Ensure old storage data has comments array (migration safety)
posts = posts.map(p => ({ ...p, comments: p.comments || [] }));

// 🌙 BONUS: Dark Mode Logic
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const htmlEl = document.documentElement;

if (localStorage.getItem('blog_theme') === 'dark' || (!('blog_theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    htmlEl.classList.add('dark');
    updateThemeIcon(true);
} else {
    updateThemeIcon(false);
}

themeToggle.addEventListener('click', () => {
    htmlEl.classList.toggle('dark');
    const isDark = htmlEl.classList.contains('dark');
    localStorage.setItem('blog_theme', isDark ? 'dark' : 'light');
    updateThemeIcon(isDark);
});

function updateThemeIcon(isDark) {
    themeIcon.innerHTML = isDark 
        ? `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>`
        : `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>`;
}

// DOM Elements
const formOverlay = document.getElementById('formOverlay');
const formModal = document.getElementById('formModal');
const readOverlay = document.getElementById('readOverlay');
const blogGrid = document.getElementById('blogGrid');
const emptyState = document.getElementById('emptyState');
const toast = document.getElementById('toast');

// Modal Toggles
document.getElementById('openFormBtn').addEventListener('click', () => openForm(false));
document.getElementById('closeFormBtn').addEventListener('click', closeForm);
document.getElementById('closeReadBtn').addEventListener('click', () => {
    readOverlay.classList.remove('modal-enter');
    setTimeout(() => readOverlay.classList.add('hidden'), 300);
});

function openForm(editMode = false) {
    formOverlay.classList.remove('hidden');
    setTimeout(() => {
        formOverlay.classList.add('modal-enter');
        formModal.classList.add('modal-scale-up');
    }, 10);
    if (!editMode) {
        document.getElementById('blogForm').reset();
        document.getElementById('postId').value = '';
        document.getElementById('formTitle').textContent = 'Create New Story';
        document.getElementById('submitBtn').textContent = 'Publish Story';
    }
}

function closeForm() {
    formOverlay.classList.remove('modal-enter');
    formModal.classList.remove('modal-scale-up');
    setTimeout(() => formOverlay.classList.add('hidden'), 300);
}

// Save & Render
function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

function renderPosts() {
    blogGrid.innerHTML = '';
    if (posts.length === 0) {
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');
        posts.forEach(post => {
            const card = document.createElement('article');
            card.className = 'bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-sm hover:shadow-xl transition flex flex-col group';
            card.innerHTML = `
                <div class="h-48 w-full overflow-hidden relative cursor-pointer" onclick="openReadMode('${post.id}')">
                    <img src="${post.image}" class="w-full h-full object-cover transform group-hover:scale-105 transition duration-500">
                    <div class="absolute inset-0 bg-stone-900/10 group-hover:bg-transparent transition"></div>
                </div>
                <div class="p-6 flex-1 flex flex-col">
                    <div class="flex justify-between items-center mb-3">
                        <span class="text-xs font-bold text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-2.5 py-1 rounded-full">${post.date}</span>
                        <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onclick="editPost('${post.id}')" class="text-stone-400 hover:text-amber-600 transition"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg></button>
                            <button onclick="deletePost('${post.id}')" class="text-stone-400 hover:text-rose-500 transition"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
                        </div>
                    </div>
                    <h3 class="text-xl font-bold text-stone-900 dark:text-white mb-2 cursor-pointer hover:text-amber-600 transition line-clamp-2" onclick="openReadMode('${post.id}')">${post.title}</h3>
                    <p class="text-stone-500 dark:text-stone-400 text-sm mb-4 line-clamp-3 flex-1">${post.content}</p>
                    <div class="flex items-center gap-2 mt-auto pt-4 border-t border-stone-100 dark:border-stone-800">
                        <div class="h-6 w-6 rounded-full bg-stone-200 dark:bg-stone-700 flex items-center justify-center text-xs font-bold text-stone-600 dark:text-stone-300">
                            ${post.author.charAt(0).toUpperCase()}
                        </div>
                        <span class="text-xs font-semibold text-stone-700 dark:text-stone-300">${post.author}</span>
                    </div>
                </div>
            `;
            blogGrid.appendChild(card);
        });
    }
}

// Add/Edit Post
document.getElementById('blogForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('postId').value;
    const author = document.getElementById('authorInput').value.trim();
    const image = document.getElementById('imageInput').value.trim();
    const title = document.getElementById('titleInput').value.trim();
    const content = document.getElementById('contentInput').value.trim();
    const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

    if (id) {
        posts = posts.map(p => p.id === id ? { ...p, author, image, title, content } : p);
    } else {
        posts.unshift({ id: Date.now().toString(), author, image, title, content, date: dateStr, comments: [] });
    }
    saveState();
    renderPosts();
    closeForm();
    showToast("Story saved successfully!");
});

window.editPost = function(id) {
    const post = posts.find(p => p.id === id);
    if (!post) return;
    document.getElementById('postId').value = post.id;
    document.getElementById('authorInput').value = post.author;
    document.getElementById('imageInput').value = post.image;
    document.getElementById('titleInput').value = post.title;
    document.getElementById('contentInput').value = post.content;
    document.getElementById('formTitle').textContent = 'Edit Story';
    document.getElementById('submitBtn').textContent = 'Update Story';
    openForm(true);
};

window.deletePost = function(id) {
    if (confirm('Delete this story?')) {
        posts = posts.filter(p => p.id !== id);
        saveState();
        renderPosts();
    }
};

// 📖 Open Read Mode & Load Bonus Features
window.openReadMode = function(id) {
    const post = posts.find(p => p.id === id);
    if (!post) return;

    document.getElementById('readImage').src = post.image;
    document.getElementById('readTitle').textContent = post.title;
    document.getElementById('readContent').textContent = post.content;
    document.getElementById('readAuthor').textContent = post.author;
    document.getElementById('readDate').textContent = post.date;
    document.getElementById('readAvatar').textContent = post.author.charAt(0).toUpperCase();
    document.getElementById('commentPostId').value = post.id;

    renderComments(post.comments);
    renderRelatedPosts(post.id);

    readOverlay.classList.remove('hidden');
    setTimeout(() => readOverlay.classList.add('modal-enter'), 10);
};

// 💬 BONUS: Comments Logic
function renderComments(comments) {
    const list = document.getElementById('commentsList');
    list.innerHTML = comments.length ? '' : '<p class="text-sm text-stone-500 dark:text-stone-400">No comments yet. Be the first to start the discussion!</p>';
    
    comments.forEach(c => {
        list.innerHTML += `
            <div class="bg-white dark:bg-stone-900 p-4 rounded-lg border border-stone-100 dark:border-stone-800">
                <p class="font-bold text-sm text-stone-900 dark:text-white mb-1">${c.name}</p>
                <p class="text-sm text-stone-600 dark:text-stone-300">${c.text}</p>
            </div>
        `;
    });
}

document.getElementById('commentForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('commentPostId').value;
    const name = document.getElementById('commenterName').value.trim();
    const text = document.getElementById('commentText').value.trim();
    
    const postIndex = posts.findIndex(p => p.id === id);
    if (postIndex > -1) {
        posts[postIndex].comments.push({ name, text });
        saveState();
        renderComments(posts[postIndex].comments);
        document.getElementById('commentForm').reset();
    }
});

// 📚 BONUS: Related Posts Logic
function renderRelatedPosts(currentId) {
    const grid = document.getElementById('relatedPostsGrid');
    grid.innerHTML = '';
    
    // Filter out current post and grab up to 2 posts
    const related = posts.filter(p => p.id !== currentId).slice(0, 2);
    
    if (related.length === 0) {
        grid.innerHTML = '<p class="text-sm text-stone-500">No related articles found.</p>';
        return;
    }

    related.forEach(post => {
        grid.innerHTML += `
            <div class="flex gap-4 cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-800 p-2 rounded-lg transition" onclick="openReadMode('${post.id}')">
                <img src="${post.image}" class="w-20 h-20 rounded-lg object-cover flex-shrink-0">
                <div>
                    <h4 class="font-bold text-stone-900 dark:text-white text-sm line-clamp-2">${post.title}</h4>
                    <p class="text-xs text-amber-600 dark:text-amber-500 mt-1">${post.date}</p>
                </div>
            </div>
        `;
    });
}

// 🔗 BONUS: Social Share Copy Link
window.copyLink = function() {
    navigator.clipboard.writeText(window.location.href);
    showToast("Link copied to clipboard!");
}

// Toast Helper
function showToast(msg) {
    toast.textContent = msg;
    toast.classList.remove('opacity-0');
    setTimeout(() => toast.classList.add('opacity-0'), 3000);
}

// Initial Render
renderPosts();