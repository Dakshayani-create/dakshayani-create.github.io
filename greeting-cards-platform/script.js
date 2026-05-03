document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Hamburger Menu ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = hamburger.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });
    }

    // --- Cart Management ---
    class CartManager {
        constructor() {
            this.items = JSON.parse(localStorage.getItem('cartItems')) || [];
            this.updateBadge();
            this.bindAddButtons();
            
            if (window.location.pathname.includes('cart.html')) {
                this.renderCart();
            }
        }

        saveCart() {
            localStorage.setItem('cartItems', JSON.stringify(this.items));
            this.updateBadge();
        }

        updateBadge() {
            const countElements = document.querySelectorAll('.cart-count');
            const totalItems = this.items.length;
            countElements.forEach(el => {
                el.textContent = totalItems;
                el.style.display = totalItems > 0 ? 'flex' : 'none';
            });
        }

        addToCart(item) {
            this.items.push(item);
            this.saveCart();
            // Show simple visual feedback
            alert(`Added "${item.title}" to cart!`);
        }

        
        clearCart() {
            this.items = [];
            this.saveCart();
            this.renderCart();
            alert("Cart cleared!");
        }

        removeFromCart(id) {
            const index = this.items.findIndex(item => item.id === id);
            if (index !== -1) {
                this.items.splice(index, 1);
                this.saveCart();
                this.renderCart();
            }
        }

        bindAddButtons() {
            const addBtns = document.querySelectorAll('.add-to-cart-btn');
            addBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const card = e.target.closest('.card');
                    if (card) {
                        const item = {
                            id: card.getAttribute('data-id') || Date.now().toString(),
                            title: card.querySelector('.card-title').textContent,
                            img: card.querySelector('.card-img').src
                        };
                        this.addToCart(item);
                    }
                });
            });
        }

        renderCart() {
            const clearBtn = document.getElementById('clearCartBtn');
            if (clearBtn) {
                clearBtn.addEventListener('click', () => {
                    if (confirm('Are you sure you want to clear your cart?')) {
                        this.clearCart();
                    }
                });
            }
    
            const container = document.getElementById('cartItemsContainer');
            const totalDisplay = document.getElementById('cartTotalItems');
            if (!container) return;

            container.innerHTML = '';
            
            if (totalDisplay) {
                totalDisplay.textContent = this.items.length;
            }

            if (this.items.length === 0) {
                container.innerHTML = `
                    <div class="empty-cart">
                        <i class="fa-solid fa-cart-shopping"></i>
                        <h2>Your cart is empty</h2>
                        <p>Looks like you haven't added any cards yet.</p>
                        <a href="cards.html" class="btn btn-primary" style="margin-top: 1rem;">Browse Cards</a>
                    </div>
                `;
                return;
            }

            this.items.forEach(item => {
                const itemEl = document.createElement('div');
                itemEl.className = 'cart-item';
                itemEl.innerHTML = `
                    <img src="${item.img}" alt="${item.title}">
                    <div class="cart-item-info">
                        <h3 class="cart-item-title">${item.title}</h3>
                    </div>
                    <button class="btn btn-danger remove-btn" data-id="${item.id}">
                        <i class="fa-solid fa-trash"></i> Remove
                    </button>
                `;
                container.appendChild(itemEl);
            });

            // Bind remove buttons
            container.querySelectorAll('.remove-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.target.closest('.remove-btn').getAttribute('data-id');
                    this.removeFromCart(id);
                });
            });
        }
    }

    const cart = new CartManager();

    // --- Search Filtering ---
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    if (searchInput && searchBtn) {
        const filterCards = () => {
            const searchTerm = searchInput.value.toLowerCase().trim();
            const cards = document.querySelectorAll('.card');
            
            cards.forEach(card => {
                const title = card.querySelector('.card-title').textContent.toLowerCase();
                const desc = card.querySelector('.card-desc') ? card.querySelector('.card-desc').textContent.toLowerCase() : '';
                
                if (title.includes(searchTerm) || desc.includes(searchTerm)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        };

        searchBtn.addEventListener('click', filterCards);
        searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') filterCards();
            else filterCards();
        });
    }

    // --- Category Filtering for Cards page ---
    const categoryBtns = document.querySelectorAll('.category-btn');
    if (categoryBtns.length > 0) {
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                categoryBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const category = btn.getAttribute('data-category');
                const cards = document.querySelectorAll('.card');
                
                cards.forEach(card => {
                    if (category === 'all' || card.getAttribute('data-category') === category) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // --- Smooth Scrolling ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Contact Form Validation ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            if (name && email && message) {
                const formMessage = document.getElementById('formMessage');
                if (formMessage) {
                    formMessage.style.display = 'block';
                    setTimeout(() => formMessage.style.display = 'none', 5000);
                } else {
                    alert('Message sent successfully!');
                }
                contactForm.reset();
            }
        });
    }
});
