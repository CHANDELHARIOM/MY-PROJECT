// Shopping Cart Functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Update cart count in navigation
function updateCartCount() {
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(el => {
        el.textContent = cart.length;
    });
}

// Display products in products page
function displayProducts(productsToDisplay = products) {
    const productsContainer = document.getElementById('productsContainer');
    if (!productsContainer) return;

    if (productsToDisplay.length === 0) {
        productsContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem;">No products found.</p>';
        return;
    }

    productsContainer.innerHTML = productsToDisplay.map(product => `
        <div class="product-card">
            <div class="product-image">${product.image}</div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <div class="product-name">${product.name}</div>
                <div class="product-description">${product.description}</div>
                <div class="product-rating">${'⭐'.repeat(Math.floor(product.rating))} ${product.rating}</div>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

// Display featured products on home page
function displayFeaturedProducts() {
    const featuredContainer = document.getElementById('featuredProducts');
    if (!featuredContainer) return;

    const featuredProducts = products.slice(0, 6);
    featuredContainer.innerHTML = featuredProducts.map(product => `
        <div class="product-card">
            <div class="product-image">${product.image}</div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <div class="product-name">${product.name}</div>
                <div class="product-description">${product.description}</div>
                <div class="product-rating">${'⭐'.repeat(Math.floor(product.rating))} ${product.rating}</div>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Show feedback
    alert(`${product.name} added to cart!`);
}

// Remove product from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    displayCartItems();
    updateCartSummary();
}

// Update quantity in cart
function updateQuantity(productId, quantity) {
    const item = cart.find(p => p.id === productId);
    if (item) {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = parseInt(quantity);
            localStorage.setItem('cart', JSON.stringify(cart));
            displayCartItems();
            updateCartSummary();
        }
    }
}

// Display cart items on cart page
function displayCartItems() {
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    if (!cartItemsContainer) return;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <p>Your cart is empty</p>
                <a href="products.html" class="btn btn-primary">Continue Shopping</a>
            </div>
        `;
        return;
    }

    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">${item.image}</div>
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <div class="cart-item-controls">
                    <label>Qty:</label>
                    <input type="number" class="quantity-input" value="${item.quantity}" 
                           onchange="updateQuantity(${item.id}, this.value)" min="1">
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Update cart summary (total, tax, shipping)
function updateCartSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 0 ? 5 : 0;
    const tax = subtotal * 0.10;
    const total = subtotal + shipping + tax;

    const subtotalEl = document.getElementById('subtotal');
    const shippingEl = document.getElementById('shipping');
    const taxEl = document.getElementById('tax');
    const totalEl = document.getElementById('total');

    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (shippingEl) shippingEl.textContent = `$${shipping.toFixed(2)}`;
    if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
}

// Update checkout summary
function updateCheckoutSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 0 ? 5 : 0;
    const tax = subtotal * 0.10;
    const total = subtotal + shipping + tax;

    document.getElementById('checkoutSubtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('checkoutShipping').textContent = `$${shipping.toFixed(2)}`;
    document.getElementById('checkoutTax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('checkoutTotal').textContent = `$${total.toFixed(2)}`;

    const orderItemsContainer = document.getElementById('orderItems');
    if (orderItemsContainer) {
        orderItemsContainer.innerHTML = cart.map(item => `
            <div class="summary-row">
                <span>${item.name} x${item.quantity}</span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `).join('');
    }
}

// Filter and search products
function filterProducts() {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const sortSelect = document.getElementById('sortSelect');

    if (!searchInput) return;

    const searchTerm = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;

    let filtered = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
                             product.description.toLowerCase().includes(searchTerm);
        const matchesCategory = !selectedCategory || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Sort products
    if (sortSelect) {
        const sortOption = sortSelect.value;
        if (sortOption === 'price-low') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sortOption === 'price-high') {
            filtered.sort((a, b) => b.price - a.price);
        } else if (sortOption === 'name') {
            filtered.sort((a, b) => a.name.localeCompare(b.name));
        }
    }

    displayProducts(filtered);
}

// Handle checkout form submission
function handleCheckoutForm() {
    const checkoutForm = document.getElementById('checkoutForm');
    if (!checkoutForm) return;

    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Simple validation
        const firstName = document.getElementById('firstName').value;
        const email = document.getElementById('email').value;
        const cardNumber = document.getElementById('cardNumber').value;

        if (!firstName || !email || !cardNumber) {
            alert('Please fill in all required fields');
            return;
        }

        // Simulate payment processing
        alert(`Order placed successfully!\n\nOrder confirmation sent to ${email}\nThank you for shopping at TechStore!`);
        
        // Clear cart
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        
        // Redirect to home page
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    });
}

// Handle login form
function handleLoginForm() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        
        localStorage.setItem('username', username);
        alert(`Welcome back, ${username}!`);
        // After successful login, go to products page
        window.location.href = 'products.html';
    });
}

// Handle signup form
function handleSignupForm() {
    const signupForm = document.getElementById('signupForm');
    if (!signupForm) return;

    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const newUsername = document.getElementById('newUsername').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (newPassword !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        localStorage.setItem('username', newUsername);
        alert(`Account created successfully! Welcome ${newUsername}`);
        window.location.href = 'index.html';
    });
}

// Toggle between login and signup forms
function toggleAuthForms() {
    const signupToggle = document.getElementById('signupToggle');
    const loginToggle = document.getElementById('loginToggle');
    const loginBox = document.querySelector('.login-box');
    const signupBox = document.querySelector('.signup-box');

    if (signupToggle) {
        signupToggle.addEventListener('click', function(e) {
            e.preventDefault();
            loginBox.style.display = 'none';
            signupBox.style.display = 'block';
        });
    }

    if (loginToggle) {
        loginToggle.addEventListener('click', function(e) {
            e.preventDefault();
            signupBox.style.display = 'none';
            loginBox.style.display = 'block';
        });
    }
}

// Initialize page on load
document.addEventListener('DOMContentLoaded', function() {
    // Update cart count on every page load
    updateCartCount();

    // Initialize based on current page
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/')) {
        displayFeaturedProducts();
    }

    if (window.location.pathname.includes('products.html')) {
        displayProducts();
        
        // Add event listeners to filters
        const searchInput = document.getElementById('searchInput');
        const categoryFilter = document.getElementById('categoryFilter');
        const sortSelect = document.getElementById('sortSelect');

        if (searchInput) searchInput.addEventListener('input', filterProducts);
        if (categoryFilter) categoryFilter.addEventListener('change', filterProducts);
        if (sortSelect) sortSelect.addEventListener('change', filterProducts);
    }

    if (window.location.pathname.includes('cart.html')) {
        displayCartItems();
        updateCartSummary();
    }

    if (window.location.pathname.includes('checkout.html')) {
        updateCheckoutSummary();
        handleCheckoutForm();
    }

    if (window.location.pathname.includes('loginpage.html')) {
        handleLoginForm();
        handleSignupForm();
        toggleAuthForms();
    }
});
