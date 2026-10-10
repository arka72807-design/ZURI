// ক্লিক সাউন্ডের জন্য
const clickSound = new Audio('data:audio/wav;base64,UklGRiIDAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YXcCAACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA='); 

function playClickSound() {
    clickSound.currentTime = 0;
    clickSound.play().catch(e => console.log("Sound play failed:", e));
}

// লোডিং স্ক্রিন হ্যান্ডলার (ফিক্সড যাতে পেজ সাদা না থাকে)
window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.getElementById('main-content');
    
    setTimeout(() => {
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
        if (mainContent) {
            mainContent.classList.remove('hidden');
            mainContent.classList.add('visible');
            mainContent.style.opacity = '1';
        }
    }, 1500);
});

// সার্চ ইনপুট হ্যান্ডলার
const searchInput = document.getElementById('search-input');
const searchSuggestions = document.getElementById('search-suggestions');

if(searchInput) {
    searchInput.addEventListener('focus', () => {
        searchSuggestions.classList.remove('hidden');
    });

    searchInput.addEventListener('blur', () => {
        setTimeout(() => {
            searchSuggestions.classList.add('hidden');
        }, 200);
    });
}

// নেভিগেশন আইটেম ও সাউন্ড
const navItems = document.querySelectorAll('.bottom-nav .nav-item');

navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        playClickSound();
        
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
        
        if (item.classList.contains('order-menu')) {
            e.preventDefault();
            const subMenu = item.querySelector('.sub-menu');
            if(subMenu) subMenu.classList.toggle('open');
        } else {
             document.querySelectorAll('.sub-menu').forEach(sm => sm.classList.remove('open'));
        }
    });
});
