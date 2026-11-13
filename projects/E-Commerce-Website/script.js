document.addEventListener('DOMContentLoaded', () => {
    const products = [
        {
            id: 1,
            title: 'Sony WH-1000XM5 Wireless Headphones',
            category: 'audio',
            price: 349.99,
            rating: 4.9,
            reviews: 1420,
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
            tag: 'Top Rated'
        },
        {
            id: 2,
            title: 'Apple MacBook Pro 16" M3 Max',
            category: 'computing',
            price: 2499.00,
            rating: 4.8,
            reviews: 850,
            image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
            tag: 'Flagship'
        },
        {
            id: 3,
            title: 'Keychron Q1 Pro Wireless Mechanical Keyboard',
            category: 'accessories',
            price: 199.50,
            rating: 4.7,
            reviews: 620,
            image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80',
            tag: 'Trending'
        },
        {
            id: 4,
            title: 'Logitech MX Master 3S Wireless Mouse',
            category: 'accessories',
            price: 99.99,
            rating: 4.9,
            reviews: 2100,
            image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80',
            tag: 'Best Seller'
        },
        {
            id: 5,
            title: 'Apple AirPods Pro (2nd Generation)',
            category: 'audio',
            price: 249.00,
            rating: 4.8,
            reviews: 1840,
            image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=600&q=80',
            tag: 'Popular'
        },
        {
            id: 6,
            title: 'Dell UltraSharp 27" 4K USB-C Hub Monitor',
            category: 'computing',
            price: 589.00,
            rating: 4.6,
            reviews: 430,
            image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80',
            tag: 'Pro Display'
        }
    ];

    let cart = [];

    const productsGrid = document.getElementById('products-grid');
    const filterPills = document.querySelectorAll('.filter-pill');
    const searchInput = document.getElementById('search-input');
    const themeBtn = document.getElementById('theme-btn');
    const cartBtn = document.getElementById('open-cart-btn');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartDrawer = document.getElementById('cart-drawer');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartItems = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');

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

    // Cart Drawer Toggle
    function toggleCart(open = true) {
        if (open) {
            cartDrawer.classList.add('active');
            cartOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            cartDrawer.classList.remove('active');
            cartOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    cartBtn.addEventListener('click', () => toggleCart(true));
    closeCartBtn.addEventListener('click', () => toggleCart(false));
    cartOverlay.addEventListener('click', () => toggleCart(false));

    // Render Products
    function renderProducts(cat = 'all', query = '') {
        const q = query.toLowerCase();
        const filtered = products.filter(p => {
            const matchesCat = cat === 'all' || p.category === cat;
            const matchesQuery = p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
            return matchesCat && matchesQuery;
        });

        productsGrid.innerHTML = '';

        if (filtered.length === 0) {
            productsGrid.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding: 3rem; color: var(--text-muted);">No products found matching your search.</div>`;
            return;
        }

        filtered.forEach(p => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <div class="product-thumb">
                    <img src="${p.image}" alt="${p.title}" loading="lazy">
                    <span class="badge-tag">${p.tag}</span>
                </div>
                <div class="product-body">
                    <span class="product-cat">${p.category}</span>
                    <h3 class="product-title">${p.title}</h3>
                    <div class="rating">
                        <i class="fa-solid fa-star"></i>
                        <span>${p.rating}</span>
                        <span class="rating-count">(${p.reviews})</span>
                    </div>
                    <div class="product-footer">
                        <span class="price">$${p.price.toFixed(2)}</span>
                        <button class="btn-add-cart" data-id="${p.id}">
                            <i class="fa-solid fa-cart-plus"></i> Add
                        </button>
                    </div>
                </div>
            `;
            productsGrid.appendChild(card);
        });

        // Add to cart event listeners
        document.querySelectorAll('.btn-add-cart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.getAttribute('data-id'), 10);
                addToCart(id);
                toggleCart(true);
            });
        });
    }

    // Filter Buttons
    filterPills.forEach(pill => {
        pill.addEventListener('click', () => {
            filterPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            const cat = pill.getAttribute('data-cat');
            renderProducts(cat, searchInput.value);
        });
    });

    searchInput.addEventListener('input', () => {
        const activeCat = document.querySelector('.filter-pill.active').getAttribute('data-cat');
        renderProducts(activeCat, searchInput.value);
    });

    // Cart Functions
    function addToCart(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        const existing = cart.find(item => item.id === productId);
        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({ ...product, qty: 1 });
        }
        updateCartUI();
    }

    function updateCartUI() {
        const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
        cartCount.textContent = totalItems;

        const totalMoney = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
        cartTotal.textContent = `$${totalMoney.toFixed(2)}`;

        cartItems.innerHTML = '';
        if (cart.length === 0) {
            cartItems.innerHTML = `<div class="empty-cart-msg"><i class="fa-solid fa-bag-shopping" style="font-size:2rem; margin-bottom:0.5rem; display:block;"></i> Your cart is empty</div>`;
            return;
        }

        cart.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'cart-item';
            itemDiv.innerHTML = `
                <img src="${item.image}" alt="${item.title}">
                <div class="cart-item-info">
                    <h4 class="cart-item-title">${item.title}</h4>
                    <span class="cart-item-price">$${item.price.toFixed(2)}</span>
                    <div class="cart-qty-ctrl">
                        <button class="qty-btn" data-action="minus" data-id="${item.id}">-</button>
                        <span>${item.qty}</span>
                        <button class="qty-btn" data-action="plus" data-id="${item.id}">+</button>
                    </div>
                </div>
            `;
            cartItems.appendChild(itemDiv);
        });

        // Quantity controls
        document.querySelectorAll('.qty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.getAttribute('data-id'), 10);
                const action = e.currentTarget.getAttribute('data-action');
                const item = cart.find(i => i.id === id);
                if (item) {
                    if (action === 'plus') item.qty += 1;
                    if (action === 'minus') item.qty -= 1;
                    if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
                }
                updateCartUI();
            });
        });
    }

    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your cart is empty! Add products first.');
            return;
        }
        alert(`Thank you for shopping with NovaStore! Order total: ${cartTotal.textContent}`);
        cart = [];
        updateCartUI();
        toggleCart(false);
    });

    renderProducts();
});