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
    
    loadHomeProducts();
    loadCategories();
    setupNavigation();
    checkAuthStatus();
});

// প্রোডাক্ট ডেটাবেস: তোর দেওয়া সঠিক প্রাইস ও স্টক অনুযায়ী
const productsData = [
    {
        id: 1,
        category: "earrings",
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
        category: "earrings",
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
        category: "earrings",
        name: "Royal Golden Pearl Chandbali Earrings",
        image: "earings_3.jpg",
        currentPrice: 129,
        originalPrice: 169,
        stock: 1,
        rating: 0,
        reviewsCount: 0
    },
    {
        id: 4,
        category: "earrings",
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
        category: "earrings",
        name: "Royal Kundan Drops",
        image: "earings_5.jpg",
        currentPrice: 159,
        originalPrice: 199,
        stock: 1,
        rating: 0,
        reviewsCount: 0
    }
];

// হোম পেজে ছোট ছোট থাম্বনেইল কার্ডে প্রোডাক্ট রেন্ডার করা
function loadHomeProducts() {
    const homeGrid = document.getElementById('home-product-grid') || document.getElementById('dynamic-product-grid');
    if (!homeGrid) return;
    
    homeGrid.innerHTML = '';
    homeGrid.style.display = 'grid';
    homeGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
    homeGrid.style.gap = '12px';
    homeGrid.style.padding = '10px';

    productsData.forEach(product => {
        const discount = Math.round(((product.originalPrice - product.currentPrice) / product.originalPrice) * 100);
        const card = document.createElement('div');
        card.style = "background: #fff; border-radius: 12px; padding: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); cursor: pointer;";
        card.onclick = () => openProductDetail(product.id);
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 130px; object-fit: cover; border-radius: 8px;">
            <div style="font-size: 0.85rem; font-weight: 600; margin-top: 8px; color: #333; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${product.name}</div>
            <div style="margin-top: 4px;">
                <span style="font-size: 0.9rem; font-weight: 700; color: #111;">₹${product.currentPrice}</span>
                <span style="font-size: 0.75rem; text-decoration: line-through; color: #888; margin-left: 6px;">₹${product.originalPrice}</span>
                <span style="font-size: 0.75rem; color: #388e3c; font-weight: 600; margin-left: 6px;">${discount}% off</span>
            </div>
        `;
        homeGrid.appendChild(card);
    });
}

// ক্যাটাগরি পেজ লোড করা
function loadCategories() {
    const catContainer = document.getElementById('category-options-container') || document.getElementById('category-section');
    if (!catContainer) return;
    
    const categories = [
        { name: "Earrings", slug: "earrings", img: "earings_1.jpg" }
    ];
    
    catContainer.innerHTML = `
        <div style="padding: 15px;">
            <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 12px;">Select Category</h3>
            <div id="cat-list"></div>
            <div id="category-product-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-top: 15px;"></div>
        </div>
    `;

    const catList = document.getElementById('cat-list');
    catList.innerHTML = categories.map(cat => `
        <div onclick="filterCategory('${cat.slug}')" style="background: #fff; padding: 12px; border-radius: 12px; display: flex; align-items: center; gap: 15px; margin-bottom: 10px; box-shadow: 0 1px 4px rgba(0,0,0,0.05); cursor: pointer;">
            <img src="${cat.img}" style="width: 50px; height: 50px; border-radius: 8px; object-fit: cover;">
            <span style="font-weight: 600; font-size: 1rem; color: #333;">${cat.name}</span>
        </div>
    `).join('');

    filterCategory('earrings');
}

function filterCategory(slug) {
    const filtered = productsData.filter(p => p.category === slug);
    const grid = document.getElementById('category-product-grid');
    if (!grid) return;
    
    grid.innerHTML = filtered.map(product => `
        <div onclick="openProductDetail(${product.id})" style="background: #fff; border-radius: 12px; padding: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); cursor: pointer;">
            <img src="${product.image}" style="width: 100%; height: 130px; object-fit: cover; border-radius: 8px;">
            <div style="font-size: 0.85rem; font-weight: 600; margin-top: 8px; color: #333;">${product.name}</div>
            <div style="margin-top: 4px;">
                <span style="font-size: 0.9rem; font-weight: 700;">₹${product.currentPrice}</span>
                <span style="font-size: 0.75rem; text-decoration: line-through; color: #888; margin-left: 6px;">₹${product.originalPrice}</span>
            </div>
        </div>
    `).join('');
}

// নেভিগেশন ট্যাব সুইচিং লজিক
function setupNavigation() {
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
                section.style.display = 'none';
            });
            
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
                targetSection.style.display = 'block';
            }
        });
    });
}

// ফ্লিপকার্ট স্টাইল প্রিমিয়াম প্রোডাক্ট ডিটেইল পেজ[span_3](start_span)[span_3](end_span)[span_4](start_span)[span_4](end_span)[span_5](start_span)[span_5](end_span)
function openProductDetail(id) {
    const product = productsData.find(p => p.id === id);
    if (!product) return;
    const discount = Math.round(((product.originalPrice - product.currentPrice) / product.originalPrice) * 100);
    
    const detailModal = document.getElementById('product-detail-page') || createDetailPageContainer();
    detailModal.style.display = 'block';
    detailModal.innerHTML = `
        <div style="background: #fff; min-height: 100vh; padding-bottom: 80px; position: relative;">
            <div style="padding: 15px; display: flex; align-items: center; border-bottom: 1px solid #eee;">
                <button onclick="closeProductDetail()" style="background: none; border: none; font-size: 1.2rem; cursor: pointer;"><i class="fas fa-arrow-left"></i></button>
                <span style="font-weight: 600; margin-left: 15px; font-size: 1rem;">Product Details</span>
            </div>
            
            <div style="background: #f9f9f9; text-align: center; padding: 20px;">
                <img src="${product.image}" style="max-height: 350px; width: 100%; object-fit: contain;">
            </div>
            
            <div style="padding: 15px;">
                <div style="font-size: 0.85rem; color: #666; font-weight: 500;">Zuri Luxury Collection</div>
                <div style="font-size: 1.1rem; font-weight: 600; color: #111; margin-top: 4px;">${product.name}</div>
                
                <div style="display: flex; align-items: baseline; gap: 10px; margin-top: 10px;">
                    <span style="color: #388e3c; font-weight: 700; font-size: 1.2rem;">↓${discount}%</span>
                    <span style="color: #888; text-decoration: line-through; font-size: 1rem;">₹${product.originalPrice}</span>
                    <span style="font-size: 1.4rem; font-weight: 700; color: #111;">₹${product.currentPrice}</span>
                </div>
                
                <div style="margin-top: 15px; background: #fdf8f0; padding: 10px; border-radius: 8px; font-size: 0.85rem; color: #b59a30;">
                    <i class="fas fa-box"></i> In Stock (${product.stock} items left)
                </div>

                <div style="margin-top: 20px; border-top: 1px solid #eee; padding-top: 15px;">
                    <div style="font-weight: 600; margin-bottom: 8px;">Delivery Details</div>
                    <div style="font-size: 0.85rem; color: #555;"><i class="fas fa-map-marker-alt"></i> Delivery by 3-5 business days</div>
                    <div style="font-size: 0.85rem; color: #555; margin-top: 5px;"><i class="fas fa-undo"></i> 10-Day Return Policy</div>
                </div>

                <div style="margin-top: 20px; border-top: 1px solid #eee; padding-top: 15px;">
                    <div style="font-weight: 600; margin-bottom: 8px;">Ratings & Reviews</div>
                    <div style="font-size: 0.85rem; color: #777;">No ratings yet. Be the first to review!</div>
                </div>
            </div>

            <!-- ফিক্সড বটম বাটন (Add to cart & Buy now) -->
            <div style="position: fixed; bottom: 0; left: 0; width: 100%; background: #fff; display: flex; border-top: 1px solid #ddd; box-shadow: 0 -2px 10px rgba(0,0,0,0.05); z-index: 1000;">
                <button onclick="alert('Added to cart successfully!')" style="flex: 1; background: #fff; color: #111; border: none; padding: 15px; font-weight: 600; font-size: 1rem; cursor: pointer;">Add to cart</button>
                <button onclick="alert('Order placed successfully!')" style="flex: 1; background: #ffd814; color: #111; border: none; padding: 15px; font-weight: 600; font-size: 1rem; cursor: pointer;">Buy now</button>
            </div>
        </div>
    `;
}

function createDetailPageContainer() {
    const div = document.createElement('div');
    div.id = 'product-detail-page';
    div.style = "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #fff; z-index: 9999; overflow-y: auto; display: none;";
    document.body.appendChild(div);
    return div;
}

function closeProductDetail() {
    const modal = document.getElementById('product-detail-page');
    if (modal) modal.style.display = 'none';
}

// ফ্লিপকার্ট স্টাইল প্রিমিয়াম প্রোফাইল ড্যাশবোর্ড[span_6](start_span)[span_6](end_span)[span_7](start_span)[span_7](end_span)[span_8](start_span)[span_8](end_span)[span_9](start_span)[span_9](end_span)[span_10](start_span)[span_10](end_span)
function showDashboard() {
    const authContainer = document.getElementById('auth-container');
    const profileDashboard = document.getElementById('profile-dashboard');
    if (!authContainer || !profileDashboard) return;

    authContainer.classList.add('hidden');
    profileDashboard.classList.remove('hidden');

    const userName = localStorage.getItem('zuriUserName') || 'Arka';

    profileDashboard.innerHTML = `
        <div style="background: #f1f3f6; min-height: 100vh; padding-bottom: 40px;">
            <div style="background: #fff; padding: 15px 20px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                <h2 style="font-size: 1.2rem; font-weight: 700; color: #111; margin: 0;">Hey, ${userName}</h2>
                <button style="background: #fff; border: 1px solid #ccc; border-radius: 20px; padding: 5px 12px; font-size: 0.8rem; font-weight: 600; display: flex; align-items: center; gap: 5px; cursor: pointer;">
                    <i class="fas fa-headset"></i> Help
                </button>
            </div>

            <div style="padding: 12px;">
                <div style="background: linear-gradient(135deg, #232526, #414345); color: #fff; padding: 15px; border-radius: 12px; margin-bottom: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                    <div style="font-size: 0.85rem; color: #ddd;">ZURI COINS WALLET</div>
                    <div style="font-size: 1.3rem; font-weight: 700; margin-top: 5px; display: flex; justify-content: space-between; align-items: center;">
                        <span><i class="fas fa-coins" style="color: #ffd700;"></i> 0 Coins Available</span>
                        <span style="font-size: 0.8rem; background: rgba(255,255,255,0.2); padding: 4px 10px; border-radius: 6px; cursor: pointer;">View</span>
                    </div>
                </div>

                <div style="display: flex; gap: 12px; margin-bottom: 12px;">
                    <div style="flex: 1; background: #fff; padding: 15px; border-radius: 12px; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,0.05); cursor: pointer;" onclick="alert('No active orders')">
                        <i class="fas fa-box" style="font-size: 1.3rem; color: #2874f0; margin-bottom: 5px;"></i>
                        <div style="font-weight: 600; font-size: 0.9rem;">Orders</div>
                    </div>
                    <div style="flex: 1; background: #fff; padding: 15px; border-radius: 12px; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,0.05); cursor: pointer;" onclick="alert('Wishlist is empty')">
                        <i class="fas fa-heart" style="font-size: 1.3rem; color: #ff6161; margin-bottom: 5px;"></i>
                        <div style="font-weight: 600; font-size: 0.9rem;">Wishlist</div>
                    </div>
                </div>

                <div style="background: #fff; padding: 15px; border-radius: 12px; margin-bottom: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                    <div style="font-weight: 700; font-size: 0.95rem; margin-bottom: 10px;">Recently Viewed Stores</div>
                    <div style="display: flex; gap: 10px; overflow-x: auto; padding-bottom: 5px;">
                        <div style="text-align: center; min-width: 80px;" onclick="openProductDetail(1)">
                            <img src="earings_1.jpg" style="width: 70px; height: 70px; border-radius: 8px; object-fit: cover;">
                            <div style="font-size: 0.75rem; margin-top: 4px; color: #333; white-space: nowrap;">Earrings</div>
                        </div>
                    </div>
                </div>

                <div style="background: #fff; padding: 15px; border-radius: 12px; margin-bottom: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <span style="font-weight: 700; font-size: 0.95rem;">Ratings & Reviews</span>
                        <span style="color: #2874f0; font-size: 0.85rem; font-weight: 600; cursor: pointer;">View all</span>
                    </div>
                    <div style="background: #fafafa; padding: 10px; border-radius: 8px; font-size: 0.85rem; color: #666; text-align: center;">
                        No ratings yet
                    </div>
                </div>

                <div style="background: #fff; border-radius: 12px; overflow: hidden; margin-bottom: 15px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                    <div style="padding: 14px 15px; border-bottom: 1px solid #f0f0f0; display: flex; justify-content: space-between; align-items: center; font-size: 0.9rem; cursor: pointer;">
                        <span><i class="fas fa-user-circle" style="color: #2874f0; margin-right: 10px;"></i> Edit profile</span>
                        <i class="fas fa-chevron-right" style="color: #bbb; font-size: 0.8rem;"></i>
                    </div>
                    <div style="padding: 14px 15px; border-bottom: 1px solid #f0f0f0; display: flex; justify-content: space-between; align-items: center; font-size: 0.9rem; cursor: pointer;">
                        <span><i class="fas fa-map-marker-alt" style="color: #2874f0; margin-right: 10px;"></i> Saved addresses</span>
                        <i class="fas fa-chevron-right" style="color: #bbb; font-size: 0.8rem;"></i>
                    </div>
                    <div style="padding: 14px 15px; display: flex; justify-content: space-between; align-items: center; font-size: 0.9rem; cursor: pointer;">
                        <span><i class="fas fa-question-circle" style="color: #2874f0; margin-right: 10px;"></i> FAQs & Terms</span>
                        <i class="fas fa-chevron-right" style="color: #bbb; font-size: 0.8rem;"></i>
                    </div>
                </div>

                <button onclick="logoutUser()" style="width: 100%; background: #fff; border: 1px solid #2874f0; color: #2874f0; padding: 12px; border-radius: 8px; font-weight: 700; font-size: 0.95rem; cursor: pointer; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                    Log out
                </button>
            </div>
        </div>
    `;
}

function logoutUser() {
    localStorage.removeItem('zuriUserLoggedIn');
    location.reload();
}

function checkAuthStatus() {
    if (localStorage.getItem('zuriUserLoggedIn') === 'true') {
        showDashboard();
    }
}