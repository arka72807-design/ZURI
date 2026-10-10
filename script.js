// লোডিং স্ক্রিন ও পেজ ন্যাভিগেশন
const clickSound = new Audio('data:audio/wav;base64,UklGRiIDAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YXcCAACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA=');

function playClickSound() {
    clickSound.currentTime = 0;
    clickSound.play().catch(e => console.log("Sound play failed:", e));
}

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

// সার্চ ইনপুট ও সাজেশন
const searchInput = document.getElementById('search-input');
const searchSuggestions = document.getElementById('search-suggestions');

if (searchInput) {
    searchInput.addEventListener('focus', () => { searchSuggestions.classList.remove('hidden'); });
    searchInput.addEventListener('blur', () => { setTimeout(() => { searchSuggestions.classList.add('hidden'); }, 200); });
}

// নেভিগেশন লজিক
const navItems = document.querySelectorAll('.bottom-nav .nav-item');
const sections = document.querySelectorAll('.content-area > div');

navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        if (item.getAttribute('href').startsWith('#')) {
            e.preventDefault();
        }
        playClickSound();
        
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
        
        const targetId = item.getAttribute('data-target');
        sections.forEach(section => {
            section.classList.add('hidden-section');
            section.classList.remove('active-section');
        });
        
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.classList.remove('hidden-section');
            targetSection.classList.add('active-section');
        }

        if (item.classList.contains('order-menu')) {
            const subMenu = item.querySelector('.sub-menu');
            if(subMenu) subMenu.classList.toggle('open');
        } else {
             document.querySelectorAll('.sub-menu').forEach(sm => sm.classList.remove('open'));
        }
    });
});

// প্রোফাইল সাইন-আপ ও লগইন লজিক
const authContainer = document.getElementById('auth-container');
const profileDashboard = document.getElementById('profile-dashboard');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const showSignupLink = document.getElementById('show-signup');
const showLoginLink = document.getElementById('show-login');
const logoutBtn = document.getElementById('logout-btn');

// ফর্ম সুইচিং
if (showSignupLink) {
    showSignupLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.classList.add('hidden');
        signupForm.classList.remove('hidden');
    });
}

if (showLoginLink) {
    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        signupForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
    });
}

// সাইন-আপ হ্যান্ডলার
if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const phone = document.getElementById('signup-phone').value;
        const password = document.getElementById('signup-password').value;
        
        if(name && email && phone && password.length >= 6) {
            localStorage.setItem('zuriUserName', name);
            localStorage.setItem('zuriUserEmail', email);
            localStorage.setItem('zuriUserPhone', phone);
            localStorage.setItem('zuriUserLoggedIn', 'true');
            
            showDashboard();
        } else {
            alert('Please fill all fields correctly. Password must be at least 6 characters.');
        }
    });
}

// লগইন হ্যান্ডলার
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        if(email && password) {
            localStorage.setItem('zuriUserLoggedIn', 'true');
            showDashboard();
        } else {
            alert('Please enter email and password.');
        }
    });
}

// লগআউট হ্যান্ডলার
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('zuriUserLoggedIn');
        showAuth();
    });
}

// ড্যাশবোর্ড এবং অথেনটিফিকেশন কার্ড দেখানো/লুকানো
function showDashboard() {
    if (authContainer && profileDashboard) {
        authContainer.classList.add('hidden');
        profileDashboard.classList.remove('hidden');
        
        const userName = localStorage.getItem('zuriUserName') || 'Valued Customer';
        const userPhone = localStorage.getItem('zuriUserPhone') || 'N/A';
        const userEmail = localStorage.getItem('zuriUserEmail') || 'N/A';
        
        document.getElementById('display-name').innerText = userName;
        document.getElementById('display-phone').innerText = `Phone: ${userPhone}`;
        document.getElementById('display-email').innerText = `Email: ${userEmail}`;
    }
}

function showAuth() {
    if (authContainer && profileDashboard) {
        profileDashboard.classList.add('hidden');
        authContainer.classList.remove('hidden');
        loginForm.reset();
        signupForm.reset();
    }
}

// পেজ লোডের সময় চেক করা যে ইউজার লগড ইন আছে কি না
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('zuriUserLoggedIn') === 'true') {
        showDashboard();
    } else {
        showAuth();
    }
});
