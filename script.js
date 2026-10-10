// ক্লিক সাউন্ডের জন্য
const clickSound = new Audio('data:audio/wav;base64,UklGRiIDAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YXcCAACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA='); 

// ক্লিক সাউন্ড প্লে করার ফাংশন
function playClickSound() {
    clickSound.currentTime = 0;
    clickSound.play().catch(e => console.log("Sound play failed:", e));
}

// লোডিং স্ক্রিন হ্যান্ডলার
window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.getElementById('main-content');
    
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            mainContent.classList.add('visible');
        }, 500); // Fade out time
    }, 1500); // Reveal time
});

// সার্চ ইনপুট হ্যান্ডলার
const searchInput = document.getElementById('search-input');
const searchSuggestions = document.getElementById('search-suggestions');

searchInput.addEventListener('focus', () => {
    searchSuggestions.classList.remove('hidden');
});

searchInput.addEventListener('blur', () => {
    setTimeout(() => {
        searchSuggestions.classList.add('hidden');
    }, 200); // Suggestions fade out
});

// নেভিগেশন আইটেম ও সাউন্ড
const navItems = document.querySelectorAll('.bottom-nav .nav-item');

navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        playClickSound();
        
        // সব অ্যাক্টিভ ক্লাস সরিয়ে দাও
        navItems.forEach(nav => nav.classList.remove('active'));
        
        // বর্তমান আইটেমে অ্যাক্টিভ ক্লাস দাও
        item.classList.add('active');
        
        // যদি এটি সাব-মেনু হয় (Orders), তবে তা টগল করো
        if (item.classList.contains('order-menu')) {
            e.preventDefault(); // লিংক রিফ্রেশ প্রিভেন্ট করো
            const subMenu = item.querySelector('.sub-menu');
            subMenu.classList.toggle('open');
        } else {
             // অন্য কোনো মেনুতে ক্লিক করলে সাব-মেনু বন্ধ করে দাও
             document.querySelectorAll('.sub-menu').forEach(sm => sm.classList.remove('open'));
        }
        
        // যদি অন্য কোনো মেনুতে ক্লিক করা হয়, তবে অর্ডার অ্যাক্টিভ থাকবে না (যদি না এটি অর্ডার মেনু হয়)
         if (!item.classList.contains('order-menu')) {
            document.querySelector('.order-menu').classList.remove('active');
        }
    });
});

// সাব-মেনুর বাইরের কোথাও ক্লিক করলে তা বন্ধ করা
document.addEventListener('click', (e) => {
    if (!e.target.closest('.bottom-nav')) {
         document.querySelectorAll('.sub-menu').forEach(sm => sm.classList.remove('open'));
         document.querySelector('.order-menu').classList.remove('active');
         document.querySelector('.home-icon').parentElement.classList.add('active'); // Default Home active
    }
});
