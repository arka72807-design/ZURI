window.addEventListener('load', () => {
    loadHomeProducts();
    loadCategoryProducts();
    showDashboard();
});

// আটটি প্রোডাক্টের ডেটা
const productsData = [
    { id: 1, category: "earrings", name: "Elegant Ruby Red Drop Earrings", image: "earings_1.jpg", currentPrice: 129, originalPrice: 160, stock: 1 },
    { id: 2, category: "earrings", name: "Midnight Sparkle Oxidized Jhumka", image: "earings_2.jpg", currentPrice: 129, originalPrice: 169, stock: 1 },
    { id: 3, category: "earrings", name: "Royal Golden Pearl Chandbali Earrings", image: "earings_3.jpg", currentPrice: 129, originalPrice: 169, stock: 1 },
    { id: 4, category: "earrings", name: "Midnight Black Oxidized Jhumka", image: "earings_4.jpg", currentPrice: 119, originalPrice: 159, stock: 1 },
    { id: 5, category: "earrings", name: "Royal Kundan Drops", image: "earings_5.jpg", currentPrice: 159, originalPrice: 199, stock: 1 },
    { id: 6, category: "earrings", name: "Traditional Temple Jhumka", image: "earings_6.jpg", currentPrice: 139, originalPrice: 189, stock: 1 },
    { id: 7, category: "earrings", name: "Antique Peacock Earrings", image: "earings_7.jpg", currentPrice: 149, originalPrice: 199, stock: 1 },
    { id: 8, category: "earrings", name: "Boho Silver Statement Drops", image: "earings_8.jpg", currentPrice: 129, originalPrice: 179, stock: 1 }
];

// ট্যাব সুইচিং ফাংশন
function switchTab(sectionId, element) {
    document.querySelectorAll('.page-section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');

    if (element) {
        document.querySelectorAll('.bottom-nav .nav-item').forEach(nav => nav.classList.remove('active'));
        element.classList.add('active');
    }
}

// হোম পেজে প্রোডাক্ট রেন্ডার করা
function loadHomeProducts() {
    const homeGrid = document.getElementById('home-product-grid');
    if (!homeGrid) return;
    
    homeGrid.innerHTML = productsData.map(product => {
        const discount = Math.round(((product.originalPrice - product.currentPrice) / product.originalPrice) * 100);
        return `
            <div onclick="openProductDetail(${product.id})" style="background: #fff; border-radius: 12px; padding: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); cursor: pointer;">
                <img src="${product.image}" style="width: 100%; height: 130px; object-fit: cover; border-radius: 8px;">
                <div style="font-size: 0.85rem; font-weight: 600; margin-top: 8px; color: #333; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${product.name}</div>
                <div style="margin-top: 4px; display: flex; align-items: baseline; gap: 6px;">
                    <span style="font-size: 0.95rem; font-weight: 700; color: #111;">₹${product.currentPrice}</span>
                    <span style="font-size: 0.75rem; text-decoration: line-through; color: #888;">₹${product.originalPrice}</span>
                    <span style="font-size: 0.7rem; color: #388e3c; font-weight: 600;">${discount}% off</span>
                </div>
            </div>
        `;
    }).join('');
}

// ক্যাটাগরি পেজে প্রোডাক্ট রেন্ডার করা
function loadCategoryProducts() {
    const catGrid = document.getElementById('category-product-grid');
    if (!catGrid) return;
    
    catGrid.innerHTML = productsData.map(product => {
        const discount = Math.round(((product.originalPrice - product.currentPrice) / product.originalPrice) * 100);
        return `
            <div onclick="openProductDetail(${product.id})" style="background: #fff; border-radius: 12px; padding: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); cursor: pointer;">
                <img src="${product.image}" style="width: 100%; height: 130px; object-fit: cover; border-radius: 8px;">
                <div style="font-size: 0.85rem; font-weight: 600; margin-top: 8px; color: #333;">${product.name}</div>
                <div style="margin-top: 4px; display: flex; align-items: baseline; gap: 6px;">
                    <span style="font-size: 0.95rem; font-weight: 700; color: #111;">₹${product.currentPrice}</span>
                    <span style="font-size: 0.75rem; text-decoration: line-through; color: #888;">₹${product.originalPrice}</span>
                    <span style="font-size: 0.7rem; color: #388e3c; font-weight: 600;">${discount}% off</span>
                </div>
            </div>
        `;
    }).join('');
}

// প্রোডাক্ট ডিটেইল পেজ
function openProductDetail(id) {
    const product = productsData.find(p => p.id === id);
    if (!product) return;
    const discount = Math.round(((product.originalPrice - product.currentPrice) / product.originalPrice) * 100);
    
    let stockHtml = `<span style="color: #388e3c; font-weight: 600;"><i class="fas fa-box"></i> In Stock (${product.stock} left)</span>`;
    let buyBtnHtml = `<button onclick="buyProduct(${product.id})" style="flex: 1; background: #ffd814; color: #111; border: none; padding: 15px; font-weight: 600; cursor: pointer;">Buy now</button>`;

    if (product.stock <= 0) {
        stockHtml = `<span style="color: #dc3545; font-weight: 700;"><i class="fas fa-box-open"></i> Sold Out</span>`;
        buyBtnHtml = `<button style="flex: 1; background: #ccc; color: #666; border: none; padding: 15px; font-weight: 600; cursor: not-allowed;" disabled>Sold Out</button>`;
    }

    let detailModal = document.getElementById('product-detail-page');
    if (!detailModal) {
        detailModal = document.createElement('div');
        detailModal.id = 'product-detail-page';
        detailModal.style = "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #fff; z-index: 9999; overflow-y: auto; display: none;";
        document.body.appendChild(detailModal);
    }
    
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
                <div style="font-size: 0.85rem; color: #666;">Zuri Luxury Collection</div>
                <div style="font-size: 1.1rem; font-weight: 600; color: #111; margin-top: 4px;">${product.name}</div>
                
                <div style="display: flex; align-items: baseline; gap: 10px; margin-top: 10px;">
                    <span style="color: #388e3c; font-weight: 700; font-size: 1.2rem;">↓${discount}%</span>
                    <span style="font-size: 1rem; text-decoration: line-through; color: #888;">₹${product.originalPrice}</span>
                    <span style="font-size: 1.4rem; font-weight: 700; color: #111;">₹${product.currentPrice}</span>
                </div>
                
                <div style="margin-top: 15px; background: #fdf8f0; padding: 10px; border-radius: 8px; font-size: 0.85rem;">
                    ${stockHtml}
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

            <div style="position: fixed; bottom: 0; left: 0; width: 100%; background: #fff; display: flex; border-top: 1px solid #ddd; z-index: 1000;">
                <button onclick="alert('Successfully added to cart!')" style="flex: 1; background: #fff; color: #111; border: none; padding: 15px; font-weight: 600; cursor: pointer;">Add to cart</button>
                ${buyBtnHtml}
            </div>
        </div>
    `;
}

function closeProductDetail() {
    const modal = document.getElementById('product-detail-page');
    if (modal) modal.style.display = 'none';
}

function buyProduct(id) {
    const product = productsData.find(p => p.id === id);
    if (product && product.stock > 0) {
        product.stock--;
        alert(`Order placed successfully for ${product.name}! Stock remaining: ${product.stock}`);
        closeProductDetail();
        loadHomeProducts();
        loadCategoryProducts();
    } else {
        alert("Sorry, this item is out of stock!");
    }
}

// পেমেন্ট মেথড পেজ ওপেন করার ফাংশন (UPI ও Card অ্যাড করার জন্য)
function openPaymentMethods() {
    let paymentModal = document.getElementById('payment-methods-page');
    if (!paymentModal) {
        paymentModal = document.createElement('div');
        paymentModal.id = 'payment-methods-page';
        paymentModal.style = "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #f8f9fa; z-index: 9999; overflow-y: auto; display: none;";
        document.body.appendChild(paymentModal);
    }
    
    paymentModal.style.display = 'block';
    paymentModal.innerHTML = `
        <div style="background: #fff; min-height: 100vh; padding-bottom: 40px;">
            <div style="padding: 15px; display: flex; align-items: center; border-bottom: 1px solid #eee; background: #fff; position: sticky; top: 0; z-index: 10;">
                <button onclick="document.getElementById('payment-methods-page').style.display='none'" style="background: none; border: none; font-size: 1.2rem; cursor: pointer;"><i class="fas fa-arrow-left"></i></button>
                <span style="font-weight: 600; margin-left: 15px; font-size: 1rem;">Saved Payment Methods</span>
            </div>
            
            <div style="padding: 15px;">
                <!-- UPI Section -->
                <div style="background: #fff; padding: 15px; border-radius: 12px; margin-bottom: 15px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                    <div style="font-weight: 700; font-size: 0.95rem; margin-bottom: 10px; color: #111;"><i class="fas fa-mobile-alt" style="color: #2874f0; margin-right: 8px;"></i> Add UPI ID</div>
                    <p style="font-size: 0.8rem; color: #666; margin-bottom: 10px;">Pay directly from your bank account using Google Pay, PhonePe, or Paytm.</p>
                    <input type="text" id="upi-input" placeholder="Enter UPI ID (e.g., username@oksbi)" style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 8px; font-size: 0.85rem; outline: none; margin-bottom: 10px;">
                    <button onclick="alert('UPI ID saved successfully!')" style="background: #2874f0; color: #fff; border: none; padding: 10px 15px; border-radius: 8px; font-weight: 600; font-size: 0.85rem; cursor: pointer;">Save UPI ID</button>
                </div>

                <!-- Cards Section -->
                <div style="background: #fff; padding: 15px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                    <div style="font-weight: 700; font-size: 0.95rem; margin-bottom: 10px; color: #111;"><i class="fas fa-credit-card" style="color: #2874f0; margin-right: 8px;"></i> Add Credit / Debit Card</div>
                    <p style="font-size: 0.8rem; color: #666; margin-bottom: 10px;">Safely save your cards for faster checkout.</p>
                    <input type="text" placeholder="Card Number" style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 8px; font-size: 0.85rem; outline: none; margin-bottom: 10px;">
                    <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                        <input type="text" placeholder="MM/YY" style="flex: 1; padding: 10px; border: 1px solid #ccc; border-radius: 8px; font-size: 0.85rem; outline: none;">
                        <input type="password" placeholder="CVV" maxlength="4" style="flex: 1; padding: 10px; border: 1px solid #ccc; border-radius: 8px; font-size: 0.85rem; outline: none;">
                    </div>
                    <button onclick="alert('Card added successfully!')" style="background: #2874f0; color: #fff; border: none; padding: 10px 15px; border-radius: 8px; font-weight: 600; font-size: 0.85rem; cursor: pointer;">Save Card</button>
                </div>
            </div>
        </div>
    `;
}

// প্রিমিয়াম ফ্লিপকার্ট স্টাইল প্রোফাইল ড্যাশবোর্ড
function showDashboard() {
    const profileDashboard = document.getElementById('profile-dashboard');
    if (!profileDashboard) return;

    profileDashboard.innerHTML = `
        <div style="background: #f1f3f6; min-height: 100vh; padding-bottom: 60px; position: relative;">
            <!-- হেডার -->
            <div style="background: #fff; padding: 15px 20px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 1px 3px rgba(0,0,0,0.05); position: sticky; top: 0; z-index: 10;">
                <h2 style="font-size: 1.2rem; font-weight: 700; color: #111; margin: 0;"><i class="fas fa-user-circle" style="color: #2874f0; margin-right: 8px;"></i> Hey, Arka</h2>
                <button onclick="window.open('https://wa.me/919432131316?text=Hello%20Zuri%20Team,%20I%20need%20help', '_blank')" style="background: #fff; border: 1px solid #ccc; border-radius: 20px; padding: 5px 12px; font-size: 0.8rem; font-weight: 600; display: flex; align-items: center; gap: 5px; cursor: pointer;">
                    <i class="fas fa-headset" style="color: #2874f0;"></i> Help
                </button>
            </div>

            <div style="padding: 12px;">
                <!-- প্রিমিয়াম জুড়ি কয়েন ওয়ালেট -->
                <div style="background: linear-gradient(135deg, #1a1a1a, #333333); color: #fff; padding: 18px; border-radius: 12px; margin-bottom: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.15); border: 1px solid #d4af37;">
                    <div style="font-size: 0.8rem; color: #d4af37; font-weight: 600; letter-spacing: 1px;">ZURI COINS WALLET</div>
                    <div style="font-size: 1.3rem; font-weight: 700; margin-top: 8px; display: flex; justify-content: space-between; align-items: center;">
                        <span><i class="fas fa-coins" style="color: #ffd700;"></i> 0 Coins Available</span>
                        <span style="font-size: 0.75rem; background: rgba(212, 175, 55, 0.2); color: #ffd700; padding: 5px 12px; border-radius: 6px; cursor: pointer; font-weight: 600;" onclick="alert('Wallet balance: 0 coins')">View Wallet</span>
                    </div>
                </div>

                <!-- অর্ডার ও উইশলিস্ট কার্ড -->
                <div style="display: flex; gap: 12px; margin-bottom: 12px;">
                    <div style="flex: 1; background: #fff; padding: 15px; border-radius: 12px; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,0.05); cursor: pointer;" onclick="switchTab('orders-section')">
                        <i class="fas fa-box" style="font-size: 1.3rem; color: #2874f0; margin-bottom: 5px;"></i>
                        <div style="font-weight: 600; font-size: 0.9rem;">Orders</div>
                    </div>
                    <div style="flex: 1; background: #fff; padding: 15px; border-radius: 12px; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,0.05); cursor: pointer;" onclick="alert('Wishlist is empty')">
                        <i class="fas fa-heart" style="font-size: 1.3rem; color: #ff6161; margin-bottom: 5px;"></i>
                        <div style="font-weight: 600; font-size: 0.9rem;">Wishlist</div>
                    </div>
                </div>

                <!-- সম্প্রতি ভিউ করা প্রোডাক্টস (Recently Viewed) -->
                <div style="background: #fff; padding: 15px; border-radius: 12px; margin-bottom: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                    <div style="font-weight: 700; font-size: 0.95rem; margin-bottom: 10px;">Recently Viewed Stores</div>
                    <div style="display: flex; gap: 10px; overflow-x: auto; padding-bottom: 5px;">
                        <div style="text-align: center; min-width: 80px; cursor: pointer;" onclick="openProductDetail(1)">
                            <img src="earings_1.jpg" style="width: 70px; height: 70px; border-radius: 8px; object-fit: cover;">
                            <div style="font-size: 0.75rem; margin-top: 4px; color: #333; white-space: nowrap;">Earrings</div>
                        </div>
                        <div style="text-align: center; min-width: 80px; cursor: pointer;" onclick="openProductDetail(2)">
                            <img src="earings_2.jpg" style="width: 70px; height: 70px; border-radius: 8px; object-fit: cover;">
                            <div style="font-size: 0.75rem; margin-top: 4px; color: #333; white-space: nowrap;">Jhumka</div>
                        </div>
                    </div>
                </div>

                <!-- রেটিংস অ্যান্ড রিভিউস -->
                <div style="background: #fff; padding: 15px; border-radius: 12px; margin-bottom: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <span style="font-weight: 700; font-size: 0.95rem;">Ratings & Reviews</span>
                        <span style="color: #2874f0; font-size: 0.85rem; font-weight: 600; cursor: pointer;" onclick="alert('No reviews yet')">View all</span>
                    </div>
                    <div style="background: #fafafa; padding: 12px; border-radius: 8px; font-size: 0.85rem; color: #666; text-align: center;">
                        No ratings given yet
                    </div>
                </div>

                <!-- পেমেন্টস অ্যান্ড ওয়ালেট অপশন -->
                <div style="background: #fff; border-radius: 12px; overflow: hidden; margin-bottom: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                    <div style="padding: 14px 15px; border-bottom: 1px solid #f0f0f0; display: flex; justify-content: space-between; align-items: center; font-size: 0.9rem; cursor: pointer;" onclick="openPaymentMethods()">
                        <span><i class="fas fa-wallet" style="color: #2874f0; margin-right: 10px;"></i> Saved payment methods</span>
                        <i class="fas fa-chevron-right" style="color: #bbb; font-size: 0.8rem;"></i>
                    </div>
                    <div style="padding: 14px 15px; display: flex; justify-content: space-between; align-items: center; font-size: 0.9rem; cursor: pointer;" onclick="alert('Gift card feature coming soon')">
                        <span><i class="fas fa-gift" style="color: #2874f0; margin-right: 10px;"></i> Add Gift Card</span>
                        <i class="fas fa-chevron-right" style="color: #bbb; font-size: 0.8rem;"></i>
                    </div>
                </div>

                <!-- প্রোফাইল সেটিংস লিস্ট -->
                <div style="background: #fff; border-radius: 12px; overflow: hidden; margin-bottom: 15px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                    <div style="padding: 14px 15px; border-bottom: 1px solid #f0f0f0; display: flex; justify-content: space-between; align-items: center; font-size: 0.9rem; cursor: pointer;" onclick="alert('Edit profile option')">
                        <span><i class="fas fa-user-edit" style="color: #2874f0; margin-right: 10px;"></i> Edit profile</span>
                        <i class="fas fa-chevron-right" style="color: #bbb; font-size: 0.8rem;"></i>
                    </div>
                    <div style="padding: 14px 15px; border-bottom: 1px solid #f0f0f0; display: flex; justify-content: space-between; align-items: center; font-size: 0.9rem; cursor: pointer;" onclick="alert('Saved addresses')">
                        <span><i class="fas fa-map-marker-alt" style="color: #2874f0; margin-right: 10px;"></i> Saved addresses</span>
                        <i class="fas fa-chevron-right" style="color: #bbb; font-size: 0.8rem;"></i>
                    </div>
                    <div style="padding: 14px 15px; display: flex; justify-content: space-between; align-items: center; font-size: 0.9rem; cursor: pointer;" onclick="window.open('https://wa.me/919432131316?text=Hello%20Zuri%20Support', '_blank')">
                        <span><i class="fab fa-whatsapp" style="color: #25d366; margin-right: 10px; font-size: 1.1rem;"></i> WhatsApp Support</span>
                        <i class="fas fa-chevron-right" style="color: #bbb; font-size: 0.8rem;"></i>
                    </div>
                </div>

                <!-- লগআউট বাটন -->
                <button onclick="location.reload();" style="width: 100%; background: #fff; border: 1px solid #2874f0; color: #2874f0; padding: 12px; border-radius: 8px; font-weight: 700; cursor: pointer; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                    <i class="fas fa-sign-out-alt" style="margin-right: 5px;"></i> Log out
                </button>
            </div>

            <!-- ভাসমান WhatsApp হেল্প বাটন -->
            <a href="https://wa.me/919432131316?text=Hello%20Zuri%20Team" target="_blank" style="position: fixed; bottom: 85px; right: 20px; background: #25d366; color: #fff; width: 50px; height: 50px; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-size: 1.6rem; box-shadow: 0 4px 10px rgba(0,0,0,0.2); z-index: 999; text-decoration: none;">
                <i class="fab fa-whatsapp"></i>
            </a>
        </div>
    `;
}window.addEventListener('load', () => {
    loadHomeProducts();
    loadCategoryProducts();
    showDashboard();
});

// আটটি প্রোডাক্টের ডেটা
const productsData = [
    { id: 1, category: "earrings", name: "Elegant Ruby Red Drop Earrings", image: "earings_1.jpg", currentPrice: 129, originalPrice: 160, stock: 1 },
    { id: 2, category: "earrings", name: "Midnight Sparkle Oxidized Jhumka", image: "earings_2.jpg", currentPrice: 129, originalPrice: 169, stock: 1 },
    { id: 3, category: "earrings", name: "Royal Golden Pearl Chandbali Earrings", image: "earings_3.jpg", currentPrice: 129, originalPrice: 169, stock: 1 },
    { id: 4, category: "earrings", name: "Midnight Black Oxidized Jhumka", image: "earings_4.jpg", currentPrice: 119, originalPrice: 159, stock: 1 },
    { id: 5, category: "earrings", name: "Royal Kundan Drops", image: "earings_5.jpg", currentPrice: 159, originalPrice: 199, stock: 1 },
    { id: 6, category: "earrings", name: "Traditional Temple Jhumka", image: "earings_6.jpg", currentPrice: 139, originalPrice: 189, stock: 1 },
    { id: 7, category: "earrings", name: "Antique Peacock Earrings", image: "earings_7.jpg", currentPrice: 149, originalPrice: 199, stock: 1 },
    { id: 8, category: "earrings", name: "Boho Silver Statement Drops", image: "earings_8.jpg", currentPrice: 129, originalPrice: 179, stock: 1 }
];

// ট্যাব সুইচিং ফাংশন
function switchTab(sectionId, element) {
    document.querySelectorAll('.page-section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');

    if (element) {
        document.querySelectorAll('.bottom-nav .nav-item').forEach(nav => nav.classList.remove('active'));
        element.classList.add('active');
    }
}

// হোম পেজে প্রোডাক্ট রেন্ডার করা
function loadHomeProducts() {
    const homeGrid = document.getElementById('home-product-grid');
    if (!homeGrid) return;
    
    homeGrid.innerHTML = productsData.map(product => {
        const discount = Math.round(((product.originalPrice - product.currentPrice) / product.originalPrice) * 100);
        return `
            <div onclick="openProductDetail(${product.id})" style="background: #fff; border-radius: 12px; padding: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); cursor: pointer;">
                <img src="${product.image}" style="width: 100%; height: 130px; object-fit: cover; border-radius: 8px;">
                <div style="font-size: 0.85rem; font-weight: 600; margin-top: 8px; color: #333; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${product.name}</div>
                <div style="margin-top: 4px; display: flex; align-items: baseline; gap: 6px;">
                    <span style="font-size: 0.95rem; font-weight: 700; color: #111;">₹${product.currentPrice}</span>
                    <span style="font-size: 0.75rem; text-decoration: line-through; color: #888;">₹${product.originalPrice}</span>
                    <span style="font-size: 0.7rem; color: #388e3c; font-weight: 600;">${discount}% off</span>
                </div>
            </div>
        `;
    }).join('');
}

// ক্যাটাগরি পেজে প্রোডাক্ট রেন্ডার করা
function loadCategoryProducts() {
    const catGrid = document.getElementById('category-product-grid');
    if (!catGrid) return;
    
    catGrid.innerHTML = productsData.map(product => {
        const discount = Math.round(((product.originalPrice - product.currentPrice) / product.originalPrice) * 100);
        return `
            <div onclick="openProductDetail(${product.id})" style="background: #fff; border-radius: 12px; padding: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); cursor: pointer;">
                <img src="${product.image}" style="width: 100%; height: 130px; object-fit: cover; border-radius: 8px;">
                <div style="font-size: 0.85rem; font-weight: 600; margin-top: 8px; color: #333;">${product.name}</div>
                <div style="margin-top: 4px; display: flex; align-items: baseline; gap: 6px;">
                    <span style="font-size: 0.95rem; font-weight: 700; color: #111;">₹${product.currentPrice}</span>
                    <span style="font-size: 0.75rem; text-decoration: line-through; color: #888;">₹${product.originalPrice}</span>
                    <span style="font-size: 0.7rem; color: #388e3c; font-weight: 600;">${discount}% off</span>
                </div>
            </div>
        `;
    }).join('');
}

// প্রোডাক্ট ডিটেইল পেজ
function openProductDetail(id) {
    const product = productsData.find(p => p.id === id);
    if (!product) return;
    const discount = Math.round(((product.originalPrice - product.currentPrice) / product.originalPrice) * 100);
    
    let stockHtml = `<span style="color: #388e3c; font-weight: 600;"><i class="fas fa-box"></i> In Stock (${product.stock} left)</span>`;
    let buyBtnHtml = `<button onclick="buyProduct(${product.id})" style="flex: 1; background: #ffd814; color: #111; border: none; padding: 15px; font-weight: 600; cursor: pointer;">Buy now</button>`;

    if (product.stock <= 0) {
        stockHtml = `<span style="color: #dc3545; font-weight: 700;"><i class="fas fa-box-open"></i> Sold Out</span>`;
        buyBtnHtml = `<button style="flex: 1; background: #ccc; color: #666; border: none; padding: 15px; font-weight: 600; cursor: not-allowed;" disabled>Sold Out</button>`;
    }

    let detailModal = document.getElementById('product-detail-page');
    if (!detailModal) {
        detailModal = document.createElement('div');
        detailModal.id = 'product-detail-page';
        detailModal.style = "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #fff; z-index: 9999; overflow-y: auto; display: none;";
        document.body.appendChild(detailModal);
    }
    
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
                <div style="font-size: 0.85rem; color: #666;">Zuri Luxury Collection</div>
                <div style="font-size: 1.1rem; font-weight: 600; color: #111; margin-top: 4px;">${product.name}</div>
                
                <div style="display: flex; align-items: baseline; gap: 10px; margin-top: 10px;">
                    <span style="color: #388e3c; font-weight: 700; font-size: 1.2rem;">↓${discount}%</span>
                    <span style="font-size: 1rem; text-decoration: line-through; color: #888;">₹${product.originalPrice}</span>
                    <span style="font-size: 1.4rem; font-weight: 700; color: #111;">₹${product.currentPrice}</span>
                </div>
                
                <div style="margin-top: 15px; background: #fdf8f0; padding: 10px; border-radius: 8px; font-size: 0.85rem;">
                    ${stockHtml}
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

            <div style="position: fixed; bottom: 0; left: 0; width: 100%; background: #fff; display: flex; border-top: 1px solid #ddd; z-index: 1000;">
                <button onclick="alert('Successfully added to cart!')" style="flex: 1; background: #fff; color: #111; border: none; padding: 15px; font-weight: 600; cursor: pointer;">Add to cart</button>
                ${buyBtnHtml}
            </div>
        </div>
    `;
}

function closeProductDetail() {
    const modal = document.getElementById('product-detail-page');
    if (modal) modal.style.display = 'none';
}

function buyProduct(id) {
    const product = productsData.find(p => p.id === id);
    if (product && product.stock > 0) {
        product.stock--;
        alert(`Order placed successfully for ${product.name}! Stock remaining: ${product.stock}`);
        closeProductDetail();
        loadHomeProducts();
        loadCategoryProducts();
    } else {
        alert("Sorry, this item is out of stock!");
    }
}

// পেমেন্ট মেথড পেজ ওপেন করার ফাংশন (UPI ও Card অ্যাড করার জন্য)
function openPaymentMethods() {
    let paymentModal = document.getElementById('payment-methods-page');
    if (!paymentModal) {
        paymentModal = document.createElement('div');
        paymentModal.id = 'payment-methods-page';
        paymentModal.style = "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #f8f9fa; z-index: 9999; overflow-y: auto; display: none;";
        document.body.appendChild(paymentModal);
    }
    
    paymentModal.style.display = 'block';
    paymentModal.innerHTML = `
        <div style="background: #fff; min-height: 100vh; padding-bottom: 40px;">
            <div style="padding: 15px; display: flex; align-items: center; border-bottom: 1px solid #eee; background: #fff; position: sticky; top: 0; z-index: 10;">
                <button onclick="document.getElementById('payment-methods-page').style.display='none'" style="background: none; border: none; font-size: 1.2rem; cursor: pointer;"><i class="fas fa-arrow-left"></i></button>
                <span style="font-weight: 600; margin-left: 15px; font-size: 1rem;">Saved Payment Methods</span>
            </div>
            
            <div style="padding: 15px;">
                <!-- UPI Section -->
                <div style="background: #fff; padding: 15px; border-radius: 12px; margin-bottom: 15px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                    <div style="font-weight: 700; font-size: 0.95rem; margin-bottom: 10px; color: #111;"><i class="fas fa-mobile-alt" style="color: #2874f0; margin-right: 8px;"></i> Add UPI ID</div>
                    <p style="font-size: 0.8rem; color: #666; margin-bottom: 10px;">Pay directly from your bank account using Google Pay, PhonePe, or Paytm.</p>
                    <input type="text" id="upi-input" placeholder="Enter UPI ID (e.g., username@oksbi)" style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 8px; font-size: 0.85rem; outline: none; margin-bottom: 10px;">
                    <button onclick="alert('UPI ID saved successfully!')" style="background: #2874f0; color: #fff; border: none; padding: 10px 15px; border-radius: 8px; font-weight: 600; font-size: 0.85rem; cursor: pointer;">Save UPI ID</button>
                </div>

                <!-- Cards Section -->
                <div style="background: #fff; padding: 15px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                    <div style="font-weight: 700; font-size: 0.95rem; margin-bottom: 10px; color: #111;"><i class="fas fa-credit-card" style="color: #2874f0; margin-right: 8px;"></i> Add Credit / Debit Card</div>
                    <p style="font-size: 0.8rem; color: #666; margin-bottom: 10px;">Safely save your cards for faster checkout.</p>
                    <input type="text" placeholder="Card Number" style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 8px; font-size: 0.85rem; outline: none; margin-bottom: 10px;">
                    <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                        <input type="text" placeholder="MM/YY" style="flex: 1; padding: 10px; border: 1px solid #ccc; border-radius: 8px; font-size: 0.85rem; outline: none;">
                        <input type="password" placeholder="CVV" maxlength="4" style="flex: 1; padding: 10px; border: 1px solid #ccc; border-radius: 8px; font-size: 0.85rem; outline: none;">
                    </div>
                    <button onclick="alert('Card added successfully!')" style="background: #2874f0; color: #fff; border: none; padding: 10px 15px; border-radius: 8px; font-weight: 600; font-size: 0.85rem; cursor: pointer;">Save Card</button>
                </div>
            </div>
        </div>
    `;
}

// প্রিমিয়াম ফ্লিপকার্ট স্টাইল প্রোফাইল ড্যাশবোর্ড
function showDashboard() {
    const profileDashboard = document.getElementById('profile-dashboard');
    if (!profileDashboard) return;

    profileDashboard.innerHTML = `
        <div style="background: #f1f3f6; min-height: 100vh; padding-bottom: 60px; position: relative;">
            <!-- হেডার -->
            <div style="background: #fff; padding: 15px 20px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 1px 3px rgba(0,0,0,0.05); position: sticky; top: 0; z-index: 10;">
                <h2 style="font-size: 1.2rem; font-weight: 700; color: #111; margin: 0;"><i class="fas fa-user-circle" style="color: #2874f0; margin-right: 8px;"></i> Hey, Arka</h2>
                <button onclick="window.open('https://wa.me/919432131316?text=Hello%20Zuri%20Team,%20I%20need%20help', '_blank')" style="background: #fff; border: 1px solid #ccc; border-radius: 20px; padding: 5px 12px; font-size: 0.8rem; font-weight: 600; display: flex; align-items: center; gap: 5px; cursor: pointer;">
                    <i class="fas fa-headset" style="color: #2874f0;"></i> Help
                </button>
            </div>

            <div style="padding: 12px;">
                <!-- প্রিমিয়াম জুড়ি কয়েন ওয়ালেট -->
                <div style="background: linear-gradient(135deg, #1a1a1a, #333333); color: #fff; padding: 18px; border-radius: 12px; margin-bottom: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.15); border: 1px solid #d4af37;">
                    <div style="font-size: 0.8rem; color: #d4af37; font-weight: 600; letter-spacing: 1px;">ZURI COINS WALLET</div>
                    <div style="font-size: 1.3rem; font-weight: 700; margin-top: 8px; display: flex; justify-content: space-between; align-items: center;">
                        <span><i class="fas fa-coins" style="color: #ffd700;"></i> 0 Coins Available</span>
                        <span style="font-size: 0.75rem; background: rgba(212, 175, 55, 0.2); color: #ffd700; padding: 5px 12px; border-radius: 6px; cursor: pointer; font-weight: 600;" onclick="alert('Wallet balance: 0 coins')">View Wallet</span>
                    </div>
                </div>

                <!-- অর্ডার ও উইশলিস্ট কার্ড -->
                <div style="display: flex; gap: 12px; margin-bottom: 12px;">
                    <div style="flex: 1; background: #fff; padding: 15px; border-radius: 12px; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,0.05); cursor: pointer;" onclick="switchTab('orders-section')">
                        <i class="fas fa-box" style="font-size: 1.3rem; color: #2874f0; margin-bottom: 5px;"></i>
                        <div style="font-weight: 600; font-size: 0.9rem;">Orders</div>
                    </div>
                    <div style="flex: 1; background: #fff; padding: 15px; border-radius: 12px; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,0.05); cursor: pointer;" onclick="alert('Wishlist is empty')">
                        <i class="fas fa-heart" style="font-size: 1.3rem; color: #ff6161; margin-bottom: 5px;"></i>
                        <div style="font-weight: 600; font-size: 0.9rem;">Wishlist</div>
                    </div>
                </div>

                <!-- সম্প্রতি ভিউ করা প্রোডাক্টস (Recently Viewed) -->
                <div style="background: #fff; padding: 15px; border-radius: 12px; margin-bottom: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                    <div style="font-weight: 700; font-size: 0.95rem; margin-bottom: 10px;">Recently Viewed Stores</div>
                    <div style="display: flex; gap: 10px; overflow-x: auto; padding-bottom: 5px;">
                        <div style="text-align: center; min-width: 80px; cursor: pointer;" onclick="openProductDetail(1)">
                            <img src="earings_1.jpg" style="width: 70px; height: 70px; border-radius: 8px; object-fit: cover;">
                            <div style="font-size: 0.75rem; margin-top: 4px; color: #333; white-space: nowrap;">Earrings</div>
                        </div>
                        <div style="text-align: center; min-width: 80px; cursor: pointer;" onclick="openProductDetail(2)">
                            <img src="earings_2.jpg" style="width: 70px; height: 70px; border-radius: 8px; object-fit: cover;">
                            <div style="font-size: 0.75rem; margin-top: 4px; color: #333; white-space: nowrap;">Jhumka</div>
                        </div>
                    </div>
                </div>

                <!-- রেটিংস অ্যান্ড রিভিউস -->
                <div style="background: #fff; padding: 15px; border-radius: 12px; margin-bottom: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <span style="font-weight: 700; font-size: 0.95rem;">Ratings & Reviews</span>
                        <span style="color: #2874f0; font-size: 0.85rem; font-weight: 600; cursor: pointer;" onclick="alert('No reviews yet')">View all</span>
                    </div>
                    <div style="background: #fafafa; padding: 12px; border-radius: 8px; font-size: 0.85rem; color: #666; text-align: center;">
                        No ratings given yet
                    </div>
                </div>

                <!-- পেমেন্টস অ্যান্ড ওয়ালেট অপশন -->
                <div style="background: #fff; border-radius: 12px; overflow: hidden; margin-bottom: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                    <div style="padding: 14px 15px; border-bottom: 1px solid #f0f0f0; display: flex; justify-content: space-between; align-items: center; font-size: 0.9rem; cursor: pointer;" onclick="openPaymentMethods()">
                        <span><i class="fas fa-wallet" style="color: #2874f0; margin-right: 10px;"></i> Saved payment methods</span>
                        <i class="fas fa-chevron-right" style="color: #bbb; font-size: 0.8rem;"></i>
                    </div>
                    <div style="padding: 14px 15px; display: flex; justify-content: space-between; align-items: center; font-size: 0.9rem; cursor: pointer;" onclick="alert('Gift card feature coming soon')">
                        <span><i class="fas fa-gift" style="color: #2874f0; margin-right: 10px;"></i> Add Gift Card</span>
                        <i class="fas fa-chevron-right" style="color: #bbb; font-size: 0.8rem;"></i>
                    </div>
                </div>

                <!-- প্রোফাইল সেটিংস লিস্ট -->
                <div style="background: #fff; border-radius: 12px; overflow: hidden; margin-bottom: 15px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                    <div style="padding: 14px 15px; border-bottom: 1px solid #f0f0f0; display: flex; justify-content: space-between; align-items: center; font-size: 0.9rem; cursor: pointer;" onclick="alert('Edit profile option')">
                        <span><i class="fas fa-user-edit" style="color: #2874f0; margin-right: 10px;"></i> Edit profile</span>
                        <i class="fas fa-chevron-right" style="color: #bbb; font-size: 0.8rem;"></i>
                    </div>
                    <div style="padding: 14px 15px; border-bottom: 1px solid #f0f0f0; display: flex; justify-content: space-between; align-items: center; font-size: 0.9rem; cursor: pointer;" onclick="alert('Saved addresses')">
                        <span><i class="fas fa-map-marker-alt" style="color: #2874f0; margin-right: 10px;"></i> Saved addresses</span>
                        <i class="fas fa-chevron-right" style="color: #bbb; font-size: 0.8rem;"></i>
                    </div>
                    <div style="padding: 14px 15px; display: flex; justify-content: space-between; align-items: center; font-size: 0.9rem; cursor: pointer;" onclick="window.open('https://wa.me/919432131316?text=Hello%20Zuri%20Support', '_blank')">
                        <span><i class="fab fa-whatsapp" style="color: #25d366; margin-right: 10px; font-size: 1.1rem;"></i> WhatsApp Support</span>
                        <i class="fas fa-chevron-right" style="color: #bbb; font-size: 0.8rem;"></i>
                    </div>
                </div>

                <!-- লগআউট বাটন -->
                <button onclick="location.reload();" style="width: 100%; background: #fff; border: 1px solid #2874f0; color: #2874f0; padding: 12px; border-radius: 8px; font-weight: 700; cursor: pointer; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                    <i class="fas fa-sign-out-alt" style="margin-right: 5px;"></i> Log out
                </button>
            </div>

            <!-- ভাসমান WhatsApp হেল্প বাটন -->
            <a href="https://wa.me/919432131316?text=Hello%20Zuri%20Team" target="_blank" style="position: fixed; bottom: 85px; right: 20px; background: #25d366; color: #fff; width: 50px; height: 50px; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-size: 1.6rem; box-shadow: 0 4px 10px rgba(0,0,0,0.2); z-index: 999; text-decoration: none;">
                <i class="fab fa-whatsapp"></i>
            </a>
        </div>
    `;
}