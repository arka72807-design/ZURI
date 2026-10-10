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

// নিখুঁতভাবে ট্যাব টগল করার লজিক (যাতে এক পেজের জিনিস অন্য পেজে না যায়)
const navItems = document.querySelectorAll('.bottom-nav .nav-item');
const sections = document.querySelectorAll('.page-section');

navItems.forEach(item => {
    item.addEventListener('click', () => {
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
        if(email) {
            localStorage.setItem('zuriUserLoggedIn', 'true');
            showDashboard();
        }
    });
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('zuriUserLoggedIn');
        showAuth();
    });
}

function showDashboard() {
    if (authContainer && profileDashboard) {
        authContainer.classList.add('hidden');
        profileDashboard.classList.remove('hidden');
        
        document.getElementById('display-name').innerText = localStorage.getItem('zuriUserName') || 'User';
        document.getElementById('display-phone').innerText = `Phone: ${localStorage.getItem('zuriUserPhone') || 'N/A'}`;
        document.getElementById('display-email').innerText = `Email: ${localStorage.getItem('zuriUserEmail') || 'N/A'}`;
    }
}

function showAuth() {
    if (authContainer && profileDashboard) {
        profileDashboard.classList.add('hidden');
        authContainer.classList.remove('hidden');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('zuriUserLoggedIn') === 'true') {
        showDashboard();
    } else {
        showAuth();
    }
});