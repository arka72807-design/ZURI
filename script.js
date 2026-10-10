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
});

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

if (coinsBoxBtn) {
    coinsBoxBtn.addEventListener('click', () => { coinsModal.classList.remove('hidden'); });
}
if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => { coinsModal.classList.add('hidden'); });
}

// ডিটেইলস পপ-আপ
const detailModal = document.getElementById('detail-modal');
const closeDetailModal = document.getElementById('close-detail-modal');
const detailModalTitle = document.getElementById('detail-modal-title');
const detailModalBody = document.getElementById('detail-modal-body');

function openDetail(title, text) {
    detailModalTitle.innerText = title;
    detailModalBody.innerHTML = `<p>${text}</p>`;
    detailModal.classList.remove('hidden');
}

const statOrders = document.getElementById('profile-stat-orders');
const statWishlist = document.getElementById('profile-stat-wishlist');
const statCart = document.getElementById('profile-stat-cart');

if(statOrders) statOrders.addEventListener('click', () => openDetail("My Orders", "You have no active orders yet. Track your ongoing and past jewelry orders here."));
if(statWishlist) statWishlist.addEventListener('click', () => openDetail("My Wishlist", "Your wishlist is empty. Save your favorite jewelry items to view them here."));
if(statCart) statCart.addEventListener('click', () => openDetail("Shopping Cart", "Your shopping cart is currently empty."));

if (closeDetailModal) {
    closeDetailModal.addEventListener('click', () => { detailModal.classList.add('hidden'); });
}

window.addEventListener('click', (e) => {
    if (e.target === coinsModal) coinsModal.classList.add('hidden');
    if (e.target === detailModal) detailModal.classList.add('hidden');
});

// প্রোফাইল লগইন ও সাইন-আপ ফিক্সড লজিক
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
            // ইউজারের ইমেইল থেকে নাম বের করে নেওয়া বা ডিফল্ট রাখা
            let userName = email.split('@')[0];
            userName = userName.charAt(0).toUpperCase() + userName.slice(1);
            
            localStorage.setItem('zuriUserName', userName);
            localStorage.setItem('zuriUserEmail', email);
            localStorage.setItem('zuriUserPhone', '9432131316'); // তোর দেওয়া ফোন নম্বর
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

// পেজ লোড হওয়ার সাথে সাথে চেক করবে ইউজার অলরেডি লগড-ইন কি না
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('zuriUserLoggedIn') === 'true') {
        showDashboard();
    } else {
        showAuth();
    }
});