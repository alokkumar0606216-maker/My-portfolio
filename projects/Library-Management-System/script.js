/**
 * LibriTrack - Library Management System
 * Interactive Logic, LocalStorage Persistence, Issue/Return Workflow
 */

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------
    // Initial Seed Dataset
    // -------------------------------------------------------------
    const DEFAULT_BOOKS = [
        {
            id: 1,
            title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
            author: 'Robert C. Martin',
            genre: 'Programming',
            isbn: '978-0132350884',
            shelf: 'Shelf A-1',
            status: 'Available',
            cover: 'https://images.unsplash.com/photo-1532012164546-f432f2e3ddb5?auto=format&fit=crop&w=600&q=80',
            description: 'Even bad code can function. But if code isn’t clean, it can bring a development organization to its knees.',
            addedAt: '2026-01-10',
            borrower: null
        },
        {
            id: 2,
            title: 'Introduction to Algorithms (CLRS)',
            author: 'Thomas H. Cormen, Charles E. Leiserson',
            genre: 'Computer Science',
            isbn: '978-0262033848',
            shelf: 'Shelf B-3',
            status: 'Issued',
            cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
            description: 'Comprehensive textbook on modern computer algorithm design, graph theories, dynamic programming, and complexity.',
            addedAt: '2026-01-15',
            borrower: {
                name: 'Rahul Sharma',
                contact: 'NIT-IT-2024-012',
                issueDate: '2026-11-01',
                dueDate: '2026-11-18'
            }
        },
        {
            id: 3,
            title: 'Designing Data-Intensive Applications',
            author: 'Martin Kleppmann',
            genre: 'Software Architecture',
            isbn: '978-1449373320',
            shelf: 'Shelf A-4',
            status: 'Available',
            cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
            description: 'The definitive guide to data systems architecture, distributed storage, replication, partitioning, and consistency.',
            addedAt: '2026-01-20',
            borrower: null
        },
        {
            id: 4,
            title: 'Python Crash Course, 3rd Edition',
            author: 'Eric Matthes',
            genre: 'Programming',
            isbn: '978-1718502703',
            shelf: 'Shelf C-2',
            status: 'Available',
            cover: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
            description: 'A hands-on, project-based introduction to the Python language, data visualization, web apps, and game development.',
            addedAt: '2026-02-01',
            borrower: null
        },
        {
            id: 5,
            title: 'You Don’t Know JS Yet: Scope & Closures',
            author: 'Kyle Simpson',
            genre: 'Web Development',
            isbn: '978-1933988696',
            shelf: 'Shelf C-5',
            status: 'Issued',
            cover: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80',
            description: 'Deep dive into the core mechanisms of JavaScript, exploring execution context, lexical scope, hoisting, and closures.',
            addedAt: '2026-02-12',
            borrower: {
                name: 'Ananya Verma',
                contact: 'NIT-IT-2024-038',
                issueDate: '2026-11-05',
                dueDate: '2026-11-20'
            }
        },
        {
            id: 6,
            title: 'Deep Learning with Python',
            author: 'François Chollet',
            genre: 'Data Science',
            isbn: '978-1617294433',
            shelf: 'Shelf D-1',
            status: 'Available',
            cover: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
            description: 'Written by the creator of Keras, this book introduces deep learning concepts using Python and modern neural networks.',
            addedAt: '2026-02-18',
            borrower: null
        }
    ];

    const STORAGE_KEY = 'libritrack_library_books';
    const THEME_KEY = 'libritrack_theme_mode';
    const VIEW_KEY = 'libritrack_catalog_view';

    // State
    let books = loadBooks();
    let currentView = localStorage.getItem(VIEW_KEY) || 'grid'; // 'grid' | 'table'

    // DOM Elements - Navigation & Theme
    const themeBtn = document.getElementById('theme-btn');
    const tabs = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    // DOM Elements - Stats
    const statTotal = document.getElementById('stat-total');
    const statAvailable = document.getElementById('stat-available');
    const statIssued = document.getElementById('stat-issued');
    const statCategories = document.getElementById('stat-categories');
    const catalogCount = document.getElementById('catalog-count');
    const loansCount = document.getElementById('loans-count');

    // DOM Elements - Toolbar & Filters
    const searchInput = document.getElementById('search-input');
    const clearSearchBtn = document.getElementById('clear-search-btn');
    const filterGenre = document.getElementById('filter-genre');
    const filterStatus = document.getElementById('filter-status');
    const sortSelect = document.getElementById('sort-select');
    const viewCardsBtn = document.getElementById('view-cards-btn');
    const viewTableBtn = document.getElementById('view-table-btn');
    const resetDataBtn = document.getElementById('reset-data-btn');

    // DOM Elements - Book Containers
    const booksGrid = document.getElementById('books-grid');
    const booksTableWrapper = document.getElementById('books-table-wrapper');
    const booksTbody = document.getElementById('books-tbody');
    const emptyState = document.getElementById('empty-state');
    const emptyAddBtn = document.getElementById('empty-add-btn');

    // DOM Elements - Loans Tab
    const loansTbody = document.getElementById('loans-tbody');
    const emptyLoans = document.getElementById('empty-loans');

    // DOM Elements - Add/Edit Book Modal
    const openAddModalBtn = document.getElementById('open-add-modal-btn');
    const bookModal = document.getElementById('book-modal');
    const modalOverlay = document.getElementById('modal-overlay');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const cancelModalBtn = document.getElementById('cancel-modal-btn');
    const bookForm = document.getElementById('book-form');
    const modalTitle = document.getElementById('modal-title');
    const modalHeaderIcon = document.getElementById('modal-header-icon');
    const editBookId = document.getElementById('edit-book-id');

    // DOM Elements - Issue Book Modal
    const issueModal = document.getElementById('issue-modal');
    const issueModalOverlay = document.getElementById('issue-modal-overlay');
    const closeIssueModalBtn = document.getElementById('close-issue-modal-btn');
    const cancelIssueBtn = document.getElementById('cancel-issue-btn');
    const issueBookForm = document.getElementById('issue-book-form');
    const issueBookId = document.getElementById('issue-book-id');
    const issueBookTitleDisplay = document.getElementById('issue-book-title-display');
    const issueBookAuthorDisplay = document.getElementById('issue-book-author-display');
    const returnDueDateInput = document.getElementById('return-due-date');

    const toastContainer = document.getElementById('toast-container');

    // -------------------------------------------------------------
    // Initialization
    // -------------------------------------------------------------
    initTheme();
    initViewToggle();
    renderAll();

    // -------------------------------------------------------------
    // Theme Handling
    // -------------------------------------------------------------
    function initTheme() {
        const savedTheme = localStorage.getItem(THEME_KEY);
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            themeBtn.querySelector('i').className = 'fa-solid fa-sun';
        } else {
            document.body.classList.remove('dark-mode');
            themeBtn.querySelector('i').className = 'fa-solid fa-moon';
        }
    }

    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
        themeBtn.querySelector('i').className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
        showToast(isDark ? 'Dark theme enabled' : 'Light theme enabled', 'info');
    });

    // -------------------------------------------------------------
    // Data Persistence
    // -------------------------------------------------------------
    function loadBooks() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    return parsed;
                }
            }
        } catch (e) {
            console.warn('Failed to parse saved books from localStorage:', e);
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_BOOKS));
        return JSON.parse(JSON.stringify(DEFAULT_BOOKS));
    }

    function saveBooks() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    }

    // Reset to initial sample data
    resetDataBtn.addEventListener('click', () => {
        if (confirm('Reload the original sample library books catalog? This will overwrite your current book list.')) {
            books = JSON.parse(JSON.stringify(DEFAULT_BOOKS));
            saveBooks();
            renderAll();
            showToast('Sample catalog has been restored!', 'success');
        }
    });

    // -------------------------------------------------------------
    // Tab Navigation
    // -------------------------------------------------------------
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            tab.classList.add('active');
            const target = tab.getAttribute('data-tab');
            document.getElementById(`tab-${target}`).classList.add('active');

            if (target === 'loans') {
                renderLoansTab();
            }
        });
    });

    // -------------------------------------------------------------
    // View Switcher (Grid vs Table)
    // -------------------------------------------------------------
    function initViewToggle() {
        applyView(currentView);

        viewCardsBtn.addEventListener('click', () => {
            applyView('grid');
        });

        viewTableBtn.addEventListener('click', () => {
            applyView('table');
        });
    }

    function applyView(view) {
        currentView = view;
        localStorage.setItem(VIEW_KEY, view);

        if (view === 'grid') {
            viewCardsBtn.classList.add('active');
            viewTableBtn.classList.remove('active');
            booksGrid.classList.remove('hidden');
            booksTableWrapper.classList.add('hidden');
        } else {
            viewTableBtn.classList.add('active');
            viewCardsBtn.classList.remove('active');
            booksTableWrapper.classList.remove('hidden');
            booksGrid.classList.add('hidden');
        }
    }

    // -------------------------------------------------------------
    // Search & Filters
    // -------------------------------------------------------------
    searchInput.addEventListener('input', () => {
        if (searchInput.value.trim().length > 0) {
            clearSearchBtn.classList.add('show');
        } else {
            clearSearchBtn.classList.remove('show');
        }
        renderCatalog();
    });

    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        clearSearchBtn.classList.remove('show');
        renderCatalog();
        searchInput.focus();
    });

    filterGenre.addEventListener('change', renderCatalog);
    filterStatus.addEventListener('change', renderCatalog);
    sortSelect.addEventListener('change', renderCatalog);

    // -------------------------------------------------------------
    // Rendering Functions
    // -------------------------------------------------------------
    function renderAll() {
        renderStats();
        renderCatalog();
        renderLoansTab();
    }

    function renderStats() {
        const total = books.length;
        const available = books.filter(b => b.status === 'Available').length;
        const issued = books.filter(b => b.status === 'Issued').length;
        const genres = new Set(books.map(b => b.genre)).size;

        statTotal.textContent = total;
        statAvailable.textContent = available;
        statIssued.textContent = issued;
        statCategories.textContent = genres;

        catalogCount.textContent = total;
        loansCount.textContent = issued;
    }

    function getFilteredAndSortedBooks() {
        const query = searchInput.value.trim().toLowerCase();
        const selectedGenre = filterGenre.value;
        const selectedStatus = filterStatus.value;
        const sortMode = sortSelect.value;

        let filtered = books.filter(b => {
            const matchesQuery = !query ||
                b.title.toLowerCase().includes(query) ||
                b.author.toLowerCase().includes(query) ||
                b.isbn.toLowerCase().includes(query) ||
                b.genre.toLowerCase().includes(query) ||
                (b.borrower && b.borrower.name.toLowerCase().includes(query));

            const matchesGenre = selectedGenre === 'all' || b.genre === selectedGenre;
            const matchesStatus = selectedStatus === 'all' || b.status === selectedStatus;

            return matchesQuery && matchesGenre && matchesStatus;
        });

        // Sorting
        filtered.sort((a, b) => {
            if (sortMode === 'title-asc') return a.title.localeCompare(b.title);
            if (sortMode === 'title-desc') return b.title.localeCompare(a.title);
            if (sortMode === 'author-asc') return a.author.localeCompare(b.author);
            // Default newest
            return (b.id || 0) - (a.id || 0);
        });

        return filtered;
    }

    function renderCatalog() {
        const filtered = getFilteredAndSortedBooks();

        if (filtered.length === 0) {
            booksGrid.innerHTML = '';
            booksTbody.innerHTML = '';
            emptyState.classList.remove('hidden');
            return;
        }

        emptyState.classList.add('hidden');

        // 1. Render Grid Cards
        booksGrid.innerHTML = filtered.map(book => createBookCardHTML(book)).join('');

        // 2. Render Table Rows
        booksTbody.innerHTML = filtered.map(book => createTableRowHTML(book)).join('');

        attachActionListeners();
    }

    function createBookCardHTML(book) {
        const isIssued = book.status === 'Issued';
        const coverHTML = book.cover
            ? `<img src="${escapeAttr(book.cover)}" alt="${escapeAttr(book.title)}" class="book-cover-img" onerror="this.parentElement.innerHTML='<div class=\\'book-cover-fallback\\'><i class=\\'fa-solid fa-book\\'></i><span>${escapeAttr(book.title)}</span></div>'">`
            : `<div class="book-cover-fallback"><i class="fa-solid fa-book"></i><span>${escapeAttr(book.title)}</span></div>`;

        let borrowerHTML = '';
        if (isIssued && book.borrower) {
            borrowerHTML = `
                <div class="borrower-banner">
                    <span class="b-label"><i class="fa-solid fa-user-check"></i> Borrowed by ${escapeHTML(book.borrower.name)}</span>
                    <div>Due: <strong>${escapeHTML(book.borrower.dueDate || 'N/A')}</strong></div>
                </div>
            `;
        }

        return `
            <div class="book-card" data-id="${book.id}">
                <div class="book-cover-area">
                    ${coverHTML}
                    <span class="book-status-badge ${isIssued ? 'issued' : 'available'}">
                        <i class="fa-solid ${isIssued ? 'fa-clock' : 'fa-check'}"></i> ${book.status}
                    </span>
                    <span class="book-genre-pill">${escapeHTML(book.genre)}</span>
                </div>

                <div class="book-details">
                    <h3 class="book-title" title="${escapeAttr(book.title)}">${escapeHTML(book.title)}</h3>
                    <div class="book-author">
                        <i class="fa-solid fa-feather-pointed"></i> ${escapeHTML(book.author)}
                    </div>

                    <div class="book-meta">
                        <div class="meta-row">
                            <span>ISBN:</span>
                            <code>${escapeHTML(book.isbn)}</code>
                        </div>
                        <div class="meta-row">
                            <span>Location:</span>
                            <span>${escapeHTML(book.shelf || 'Main Library')}</span>
                        </div>
                    </div>

                    ${borrowerHTML}

                    <div class="book-actions">
                        ${isIssued ? `
                            <button class="btn-card-action btn-return" data-action="return" data-id="${book.id}">
                                <i class="fa-solid fa-rotate-left"></i> Return Book
                            </button>
                        ` : `
                            <button class="btn-card-action btn-issue" data-action="issue" data-id="${book.id}">
                                <i class="fa-solid fa-hand-holding-hand"></i> Issue Book
                            </button>
                        `}
                        <button class="btn-icon-only btn-edit-card" data-action="edit" data-id="${book.id}" title="Edit details">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button class="btn-icon-only btn-delete-card" data-action="delete" data-id="${book.id}" title="Delete book">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    function createTableRowHTML(book) {
        const isIssued = book.status === 'Issued';
        const coverSrc = book.cover || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=150&q=80';

        return `
            <tr data-id="${book.id}">
                <td>
                    <div class="table-book-info">
                        <img src="${escapeAttr(coverSrc)}" alt="Cover" class="table-book-cover" onerror="this.style.display='none'">
                        <div>
                            <span class="table-book-title">${escapeHTML(book.title)}</span>
                            <span class="table-book-subtitle">${escapeHTML(book.author)}</span>
                        </div>
                    </div>
                </td>
                <td>${escapeHTML(book.author)}</td>
                <td><span class="badge" style="background:var(--card-bg-subtle); padding: 0.25rem 0.6rem; border-radius: 6px; border:1px solid var(--border); font-size:0.75rem;">${escapeHTML(book.genre)}</span></td>
                <td><code>${escapeHTML(book.isbn)}</code></td>
                <td>${escapeHTML(book.shelf || 'Shelf A-1')}</td>
                <td>
                    <span class="status-badge ${isIssued ? 'issued' : 'available'}">
                        <i class="fa-solid ${isIssued ? 'fa-clock' : 'fa-check'}"></i> ${book.status}
                    </span>
                </td>
                <td>
                    <div class="actions-cell">
                        ${isIssued ? `
                            <button class="btn-secondary" data-action="return" data-id="${book.id}" style="padding: 0.35rem 0.75rem; font-size: 0.8rem; color: var(--success); border-color: var(--success);">
                                <i class="fa-solid fa-rotate-left"></i> Return
                            </button>
                        ` : `
                            <button class="btn-secondary" data-action="issue" data-id="${book.id}" style="padding: 0.35rem 0.75rem; font-size: 0.8rem; color: var(--primary); border-color: var(--primary);">
                                <i class="fa-solid fa-hand-holding-hand"></i> Issue
                            </button>
                        `}
                        <button class="btn-icon-only" data-action="edit" data-id="${book.id}" title="Edit Book">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button class="btn-icon-only btn-delete-card" data-action="delete" data-id="${book.id}" title="Delete Book">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }

    function renderLoansTab() {
        const issuedBooks = books.filter(b => b.status === 'Issued' && b.borrower);

        if (issuedBooks.length === 0) {
            loansTbody.innerHTML = '';
            emptyLoans.classList.remove('hidden');
            return;
        }

        emptyLoans.classList.add('hidden');
        const today = new Date().toISOString().split('T')[0];

        loansTbody.innerHTML = issuedBooks.map(book => {
            const b = book.borrower;
            const isOverdue = b.dueDate && b.dueDate < today;

            return `
                <tr>
                    <td>
                        <strong style="color:var(--text-main); font-size:0.92rem;">${escapeHTML(book.title)}</strong>
                        <div style="font-size:0.75rem; color:var(--text-muted);">${escapeHTML(book.author)}</div>
                    </td>
                    <td><strong>${escapeHTML(b.name)}</strong></td>
                    <td><code>${escapeHTML(b.contact || 'N/A')}</code></td>
                    <td>${escapeHTML(b.issueDate || 'N/A')}</td>
                    <td><strong>${escapeHTML(b.dueDate || 'N/A')}</strong></td>
                    <td>
                        <span class="due-badge ${isOverdue ? 'overdue' : 'ok'}">
                            ${isOverdue ? '<i class="fa-solid fa-triangle-exclamation"></i> Overdue' : '<i class="fa-solid fa-clock"></i> Active'}
                        </span>
                    </td>
                    <td class="text-right">
                        <button class="btn-primary" data-action="return" data-id="${book.id}" style="padding: 0.4rem 0.9rem; font-size: 0.82rem;">
                            <i class="fa-solid fa-rotate-left"></i> Return Book
                        </button>
                    </td>
                </tr>
            `;
        }).join('');

        // Attach returns inside the loans table
        loansTbody.querySelectorAll('[data-action="return"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.getAttribute('data-id'), 10);
                returnBook(id);
            });
        });
    }

    // -------------------------------------------------------------
    // Book Actions: Return, Issue Modal, Edit Modal, Delete
    // -------------------------------------------------------------
    function attachActionListeners() {
        // Return Book
        document.querySelectorAll('[data-action="return"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.getAttribute('data-id'), 10);
                returnBook(id);
            });
        });

        // Issue Book Modal
        document.querySelectorAll('[data-action="issue"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.getAttribute('data-id'), 10);
                openIssueModal(id);
            });
        });

        // Edit Book Modal
        document.querySelectorAll('[data-action="edit"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.getAttribute('data-id'), 10);
                openEditModal(id);
            });
        });

        // Delete Book
        document.querySelectorAll('[data-action="delete"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.getAttribute('data-id'), 10);
                deleteBook(id);
            });
        });
    }

    function returnBook(id) {
        const book = books.find(b => b.id === id);
        if (!book) return;

        if (confirm(`Confirm return for "${book.title}"?`)) {
            book.status = 'Available';
            book.borrower = null;
            saveBooks();
            renderAll();
            showToast(`"${book.title}" has been returned to the catalog!`, 'success');
        }
    }

    function deleteBook(id) {
        const book = books.find(b => b.id === id);
        if (!book) return;

        if (confirm(`Are you sure you want to delete "${book.title}" from the library system?`)) {
            books = books.filter(b => b.id !== id);
            saveBooks();
            renderAll();
            showToast(`Book record removed from system.`, 'info');
        }
    }

    // -------------------------------------------------------------
    // Add / Edit Modal Logic
    // -------------------------------------------------------------
    function openAddModal() {
        bookForm.reset();
        editBookId.value = '';
        modalTitle.textContent = 'Add New Book';
        modalHeaderIcon.className = 'fa-solid fa-book-medical';
        bookModal.classList.add('active');
        document.getElementById('book-title').focus();
    }

    function openEditModal(id) {
        const book = books.find(b => b.id === id);
        if (!book) return;

        editBookId.value = book.id;
        modalTitle.textContent = 'Edit Book Details';
        modalHeaderIcon.className = 'fa-solid fa-pen-to-square';

        document.getElementById('book-title').value = book.title || '';
        document.getElementById('book-author').value = book.author || '';
        document.getElementById('book-genre').value = book.genre || 'Programming';
        document.getElementById('book-isbn').value = book.isbn || '';
        document.getElementById('book-shelf').value = book.shelf || '';
        document.getElementById('book-cover').value = book.cover || '';
        document.getElementById('book-desc').value = book.description || '';

        bookModal.classList.add('active');
    }

    function closeBookModal() {
        bookModal.classList.remove('active');
        bookForm.reset();
    }

    openAddModalBtn.addEventListener('click', openAddModal);
    emptyAddBtn.addEventListener('click', openAddModal);
    closeModalBtn.addEventListener('click', closeBookModal);
    cancelModalBtn.addEventListener('click', closeBookModal);
    modalOverlay.addEventListener('click', closeBookModal);

    bookForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const idVal = editBookId.value;
        const title = document.getElementById('book-title').value.trim();
        const author = document.getElementById('book-author').value.trim();
        const genre = document.getElementById('book-genre').value;
        const isbn = document.getElementById('book-isbn').value.trim();
        const shelf = document.getElementById('book-shelf').value.trim() || 'Main Shelf';
        const cover = document.getElementById('book-cover').value.trim();
        const description = document.getElementById('book-desc').value.trim();

        if (idVal) {
            // Edit existing
            const bookId = parseInt(idVal, 10);
            const book = books.find(b => b.id === bookId);
            if (book) {
                book.title = title;
                book.author = author;
                book.genre = genre;
                book.isbn = isbn;
                book.shelf = shelf;
                book.cover = cover;
                book.description = description;
                showToast(`Book "${title}" updated successfully!`, 'success');
            }
        } else {
            // Create new
            const newBook = {
                id: Date.now(),
                title,
                author,
                genre,
                isbn,
                shelf,
                cover,
                description,
                status: 'Available',
                addedAt: new Date().toISOString().split('T')[0],
                borrower: null
            };
            books.unshift(newBook);
            showToast(`"${title}" added to the library catalog!`, 'success');
        }

        saveBooks();
        closeBookModal();
        renderAll();
    });

    // -------------------------------------------------------------
    // Issue Modal Logic
    // -------------------------------------------------------------
    function openIssueModal(id) {
        const book = books.find(b => b.id === id);
        if (!book) return;

        issueBookId.value = book.id;
        issueBookTitleDisplay.textContent = book.title;
        issueBookAuthorDisplay.textContent = `by ${book.author} • ISBN: ${book.isbn}`;

        // Default due date to 14 days ahead
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 14);
        returnDueDateInput.value = dueDate.toISOString().split('T')[0];

        issueBookForm.reset();
        returnDueDateInput.value = dueDate.toISOString().split('T')[0];
        issueModal.classList.add('active');
        document.getElementById('borrower-name').focus();
    }

    function closeIssueModal() {
        issueModal.classList.remove('active');
        issueBookForm.reset();
    }

    closeIssueModalBtn.addEventListener('click', closeIssueModal);
    cancelIssueBtn.addEventListener('click', closeIssueModal);
    issueModalOverlay.addEventListener('click', closeIssueModal);

    issueBookForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const bookId = parseInt(issueBookId.value, 10);
        const book = books.find(b => b.id === bookId);
        if (!book) return;

        const borrowerName = document.getElementById('borrower-name').value.trim();
        const borrowerContact = document.getElementById('borrower-contact').value.trim();
        const dueDate = returnDueDateInput.value;
        const today = new Date().toISOString().split('T')[0];

        book.status = 'Issued';
        book.borrower = {
            name: borrowerName,
            contact: borrowerContact,
            issueDate: today,
            dueDate: dueDate
        };

        saveBooks();
        closeIssueModal();
        renderAll();
        showToast(`Book issued to ${borrowerName}! Due on ${dueDate}.`, 'success');
    });

    // -------------------------------------------------------------
    // Toast Notification System
    // -------------------------------------------------------------
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;

        let icon = 'fa-solid fa-circle-info';
        if (type === 'success') icon = 'fa-solid fa-circle-check';
        if (type === 'error') icon = 'fa-solid fa-triangle-exclamation';

        toast.innerHTML = `
            <i class="${icon}"></i>
            <span class="toast-message">${escapeHTML(message)}</span>
        `;

        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            setTimeout(() => toast.remove(), 300);
        }, 3200);
    }

    // -------------------------------------------------------------
    // Safe HTML Escaping Utilities
    // -------------------------------------------------------------
    function escapeHTML(str) {
        if (!str) return '';
        return String(str).replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }

    function escapeAttr(str) {
        if (!str) return '';
        return String(str).replace(/"/g, '&quot;');
    }
});
