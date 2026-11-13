document.addEventListener('DOMContentLoaded', () => {
    // Initial books data
    let books = [
        { id: 1, title: 'Clean Code: A Handbook of Agile Software', author: 'Robert C. Martin', genre: 'Programming', isbn: '978-0132350884', status: 'Available' },
        { id: 2, title: 'Introduction to Algorithms (CLRS)', author: 'Thomas H. Cormen', genre: 'Computer Science', isbn: '978-0262033848', status: 'Issued' },
        { id: 3, title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann', genre: 'Programming', isbn: '978-1449373320', status: 'Available' },
        { id: 4, title: 'Python Crash Course', author: 'Eric Matthes', genre: 'Programming', isbn: '978-1593279288', status: 'Available' }
    ];

    const booksTbody = document.getElementById('books-tbody');
    const statTotal = document.getElementById('stat-total');
    const statAvailable = document.getElementById('stat-available');
    const statIssued = document.getElementById('stat-issued');
    const searchInput = document.getElementById('search-input');
    const filterStatus = document.getElementById('filter-status');
    const openModalBtn = document.getElementById('open-modal-btn');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const cancelModalBtn = document.getElementById('cancel-modal-btn');
    const modalOverlay = document.getElementById('modal-overlay');
    const bookModal = document.getElementById('book-modal');
    const addBookForm = document.getElementById('add-book-form');
    const themeBtn = document.getElementById('theme-btn');

    // Theme toggle
    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const icon = themeBtn.querySelector('i');
        if (document.body.classList.contains('dark-mode')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    });

    // Modal Handlers
    function openModal() {
        bookModal.classList.add('active');
    }
    function closeModal() {
        bookModal.classList.remove('active');
        addBookForm.reset();
    }

    openModalBtn.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);
    cancelModalBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);

    // Form submit
    addBookForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newBook = {
            id: Date.now(),
            title: document.getElementById('book-title').value.trim(),
            author: document.getElementById('book-author').value.trim(),
            genre: document.getElementById('book-genre').value,
            isbn: document.getElementById('book-isbn').value.trim(),
            status: 'Available'
        };

        books.unshift(newBook);
        closeModal();
        renderTable();
    });

    // Render Table
    function renderTable() {
        const query = searchInput.value.toLowerCase();
        const statusFilter = filterStatus.value;

        const filtered = books.filter(b => {
            const matchesQuery = b.title.toLowerCase().includes(query) ||
                                 b.author.toLowerCase().includes(query) ||
                                 b.genre.toLowerCase().includes(query) ||
                                 b.isbn.toLowerCase().includes(query);
            const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
            return matchesQuery && matchesStatus;
        });

        booksTbody.innerHTML = '';

        if (filtered.length === 0) {
            booksTbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 2rem; color: var(--text-muted);">No books match your criteria.</td></tr>`;
        } else {
            filtered.forEach(book => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><strong>${escapeHTML(book.title)}</strong></td>
                    <td>${escapeHTML(book.author)}</td>
                    <td>${escapeHTML(book.genre)}</td>
                    <td><code>${escapeHTML(book.isbn)}</code></td>
                    <td>
                        <span class="badge ${book.status.toLowerCase()}">${book.status}</span>
                    </td>
                    <td class="actions-cell">
                        <button class="btn-action btn-toggle-issue" data-id="${book.id}">
                            ${book.status === 'Available' ? '<i class="fa-solid fa-arrow-right-arrow-left"></i> Issue' : '<i class="fa-solid fa-rotate-left"></i> Return'}
                        </button>
                        <button class="btn-action btn-delete" data-id="${book.id}" title="Delete Book">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </td>
                `;
                booksTbody.appendChild(tr);
            });
        }

        // Action buttons
        document.querySelectorAll('.btn-toggle-issue').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.getAttribute('data-id'), 10);
                const book = books.find(b => b.id === id);
                if (book) {
                    book.status = book.status === 'Available' ? 'Issued' : 'Available';
                    renderTable();
                }
            });
        });

        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.getAttribute('data-id'), 10);
                if (confirm('Are you sure you want to delete this book record?')) {
                    books = books.filter(b => b.id !== id);
                    renderTable();
                }
            });
        });

        // Update stats
        statTotal.textContent = books.length;
        statAvailable.textContent = books.filter(b => b.status === 'Available').length;
        statIssued.textContent = books.filter(b => b.status === 'Issued').length;
    }

    searchInput.addEventListener('input', renderTable);
    filterStatus.addEventListener('change', renderTable);

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }

    renderTable();
});