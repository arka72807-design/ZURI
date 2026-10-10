window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.getElementById('main-content');
    
    setTimeout(() => {
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => { loadingScreen.style.display = 'none'; }, 500);
        }
        if (mainContent) {
            mainContent.classList.remove('hidden');
            mainContent.classList.add('visible');
            mainContent.style.opacity = '1';
        }
    }, 1500);
    
    loadProducts();
});

// প্রোডাক্ট ডেটাবেস: এখানে স্টক, রেটিং ও রিভিউ কাউন্ট একদম জিরো/খালি রাখা হয়েছে। তুই নিজের মতো ডেটা দিবি।
const productsData = [
    {
        id: 1,
        name: "Elegant Ruby Red Drop Earrings",
        image: "earings_1.jpg",
        currentPrice: 129,
        originalPrice: 160,
        stock: 1,
        rating: 0,
        reviewsCount: 0
    },
{
        id: 2,
        name: "Midnight Sparkle Oxidized Jhumka",
        image: "earings_2.jpg",
        currentPrice: 129,
        originalPrice: 169,
        stock: 1,
        rating: 0,
        reviewsCount: 0
    },
{
        id: 3,
        name: "Royal Golden Pearl Chandbali Earrings",
        image: "earings_3.jpg",
        currentPrice: 129,
        originalPrice: 160,
        stock: 1,
        rating: 0,
        reviewsCount: 0
    },
{
        id: 4,
        name: "Midnight Black Oxidized Jhumka",
        image: "earings_4.jpg",
        currentPrice: 119,
        originalPrice: 159,
        stock: 1,
        rating: 0,
        reviewsCount: 0
    },
{
        id: 5,
        name: "Royal Kundan Drops",
        image: "earings_5.jpg",
        currentPrice: 159,
        originalPrice: 199,
        stock: 1,
        rating: 0,
        reviewsCount: 0
    },
{
        id: 6,
        name: "Starry Pearl Studs",
        image: "earings_6.jpg",
        currentPrice: 59,
        originalPrice: 99,
        stock: 1,
        rating: 0,
        reviewsCount: 0
    },
{
        id: 7,
        name: "Boho Mirror Jhumka",
        image: "earings_7.jpg",
        currentPrice: 139,
        originalPrice: 180,
        stock: 1,
        rating: 0,
        reviewsCount: 0
    },
{
        id: 8,
        name: "Silver Gleam jhumka",
        image: "earings_8.jpg",
        currentPrice: 199,
        originalPrice: 250,
        stock: 1,
        rating: 0,
        reviewsCount: 0
    },

];

// ক্যাটাগরি পেজে প্রোডাক্টগুলো অটো রেন্ডার করার ফাংশন
function loadProducts() {
    const gridContainer = document.getElementById('dynamic-product-grid');
    if (!gridContainer) return;

    gridContainer.innerHTML = '';

    if (productsData.length === 0) {
        gridContainer.innerHTML = `<div class="empty-state" style="grid-column: span 2; text-align: center; padding: 30px; color: #777;">No products added yet. Add your products in script.js to display here.</div>`;
        return;
    }

    productsData.forEach(product => {
        const discount = product.originalPrice > product.currentPrice ? Math.round(((product.originalPrice - product.currentPrice) / product.originalPrice) * 100) : 0;
        
        let stockHtml = `<span style="font-size: 0.75rem; color: #28a745; font-weight: 600;">In Stock (${product.stock} left)</span>`;
        let btnHtml = `<button class="add-cart-btn" onclick="buyProduct(${product.id})">Add to Cart</button>`;

        if (product.stock <= 0) {
            stockHtml = `<span style="font-size: 0.75rem; color: #dc3545; font-weight: 700;">Sold Out</span>`;
            btnHtml = `<button class="add-cart-btn" style="background: #ccc; cursor: not-allowed;" disabled>Sold Out</button>`;
        }

        const card = document.createElement('div');
        card.className = 'jewelry-item-card';
        card.innerHTML = `
            <span class="discount-badge">${discount}% OFF</span>
            <img src="${product.image}" alt="${product.name}" class="jewelry-img">
            <div class="jewelry-title">${product.name}</div>
            <div class="price-container">
                <span class="current-price">₹${product.currentPrice}</span>
                <span class="original-price">₹${product.originalPrice}</span>
            </div>
            <div style="margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">
                ${stockHtml}
                <span style="font-size: 0.75rem; color: #b59a30;"><i class="fas fa-star"></i> ${product.rating} (${product.reviewsCount})</span>
            </div>
            ${btnHtml}
            <button class="add-cart-btn" style="background: #d4af37; margin-top: 5px;" onclick="openReviewModal(${product.id})">Write a Review</button>
        `;
        gridContainer.appendChild(card);
    });
}

function buyProduct(id) {
    const product = productsData.find(p => p.id === id);
    if (product && product.stock > 0) {
        product.stock--;
        alert(`Order successful for ${product.name}! Stock remaining: ${product.stock}`);
        loadProducts();
    }
}

function openReviewModal(id) {
    const product = productsData.find(p => p.id === id);
    const reviewText = prompt(`Write your review for ${product.name} (Rate 1 to 5):`);
    if (reviewText) {
        alert("Thank you! Your review has been submitted successfully.");
        product.reviewsCount++;
        loadProducts();
    }
}

// ন্যাভিগেশন ট্যাব সুইচিং
const navItems = document.querySelectorAll('.bottom-nav .nav-item');
const sections = document.querySelectorAll('.page-section');

navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
        
        const targetId = item.getAttribute('data-target');
        sections.forEach(section => {
            section.classList.remove('active');
        });
        
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.classList.add('active');
        }
    });
});

// কয়েন পপ-আপ মডাল
const coinsBoxBtn = document.getElementById('coins-box-btn');
const coinsModal = document.getElementById('coins-modal');
const closeModalBtn = document.getElementById('close-modal-btn');

if (coinsBoxBtn) coinsBoxBtn.addEventListener('click', () => coinsModal.classList.remove('hidden'));
if (closeModalBtn) closeModalBtn.addEventListener('click', () => coinsModal.classList.add('hidden'));

// প্রোফাইল অপশন ক্লিক হ্যান্ডলার
function openDetail(title, text) {
    const detailModal = document.getElementById('detail-modal');
    document.getElementById('detail-modal-title').innerText = title;
    document.getElementById('detail-modal-body').innerHTML = `<p>${text}</p>`;
    detailModal.classList.remove('hidden');
}

const statOrders = document.getElementById('profile-stat-orders');
const statWishlist = document.getElementById('profile-stat-wishlist');
const statCart = document.getElementById('profile-stat-cart');

if(statOrders) statOrders.addEventListener('click', () => openDetail("My Orders", "You have no active orders yet. Track your ongoing and past jewelry orders here."));
if(statWishlist) statWishlist.addEventListener('click', () => openDetail("My Wishlist", "Your wishlist is empty. Save your favorite jewelry items to view them here."));
if(statCart) statCart.addEventListener('click', () => openDetail("Shopping Cart", "Your shopping cart is currently empty."));

const closeDetailModal = document.getElementById('close-detail-modal');
if (closeDetailModal) closeDetailModal.addEventListener('click', () => document.getElementById('detail-modal').classList.add('hidden'));

window.addEventListener('click', (e) => {
    if (e.target === coinsModal) coinsModal.classList.add('hidden');
    if (e.target === document.getElementById('detail-modal')) document.getElementById('detail-modal').classList.add('hidden');
});

// প্রোফাইল লগইন ও সাইন-আপ লজিক
const authContainer = document.getElementById('auth-container');
const profileDashboard = document.getElementById('profile-dashboard');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const showSignupLink = document.getElementById('show-signup');
const showLoginLink = document.getElementById('show-login');
const logoutBtn = document.getElementById('logout-btn');

if (showSignupLink) {
    showSignupLink.addEventListener('click', (e) => {
        e.preventDefault();
        if(loginForm) loginForm.classList.add('hidden');
        if(signupForm) signupForm.classList.remove('hidden');
    });
}

if (showLoginLink) {
    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        if(signupForm) signupForm.classList.add('hidden');
        if(loginForm) loginForm.classList.remove('hidden');
    });
}

if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const phone = document.getElementById('signup-phone').value;
        
        if(name && email && phone) {
            localStorage.setItem('zuriUserName', name);
            localStorage.setItem('zuriUserEmail', email);
            localStorage.setItem('zuriUserPhone', phone);
            localStorage.setItem('zuriUserLoggedIn', 'true');
            showDashboard();
        }
    });
}

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        if(email && password) {
            let userName = localStorage.getItem('zuriUserName') || email.split('@')[0];
            userName = userName.charAt(0).toUpperCase() + userName.slice(1);
            let userPhone = localStorage.getItem('zuriUserPhone') || 'Not Provided';
            
            localStorage.setItem('zuriUserName', userName);
            localStorage.setItem('zuriUserEmail', email);
            localStorage.setItem('zuriUserPhone', userPhone);
            localStorage.setItem('zuriUserLoggedIn', 'true');
            
            showDashboard();
        }
    });
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('zuriUserLoggedIn');
        showAuth();
    });
}

function showDashboard() {
    if (authContainer && profileDashboard) {
        authContainer.classList.add('hidden');
        profileDashboard.classList.remove('hidden');
        
        const displayName = document.getElementById('display-name');
        const displayPhone = document.getElementById('display-phone');
        const displayEmail = document.getElementById('display-email');
        
        if(displayName) displayName.innerText = localStorage.getItem('zuriUserName') || 'User';
        if(displayPhone) displayPhone.innerText = `Phone: ${localStorage.getItem('zuriUserPhone') || 'N/A'}`;
        if(displayEmail) displayEmail.innerText = `Email: ${localStorage.getItem('zuriUserEmail') || 'N/A'}`;
    }
}

function showAuth() {
    if (authContainer && profileDashboard) {
        profileDashboard.classList.add('hidden');
        authContainer.classList.remove('hidden');
        if(loginForm) loginForm.reset();
        if(signupForm) signupForm.reset();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('zuriUserLoggedIn') === 'true') {
        showDashboard();
    } else {
        showAuth();
    }
});