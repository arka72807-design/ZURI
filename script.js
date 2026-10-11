window.addEventListener('load', () => {
    // স্প্ল্যাশ স্ক্রিন ১.৫ সেকেন্ড পর ফেড আউট হবে
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        if (splash) {
            splash.style.opacity = '0';
            setTimeout(() => splash.style.display = 'none', 500);
        }
    }, 1500);

    loadHomeProducts();
    loadCategoryProducts();
    showDashboard();
    loadOrders();
});

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

let userOrders = JSON.parse(localStorage.getItem('zuri_orders')) || [];
let zuriCoins = parseInt(localStorage.getItem('zuri_coins')) || 0;
let loggedInUser = { name: "Arka", phone: "" };

function switchTab(sectionId, element) {
    document.querySelectorAll('.page-section').forEach(sec => {
        sec.classList.remove('active');
        sec.style.display = 'none';
    });
    
    const target = document.getElementById(sectionId);
    if (target) {
        target.classList.add('active');
        target.style.display = 'block';
    }

    if (element) {
        document.querySelectorAll('.bottom-nav .nav-item').forEach(nav => nav.classList.remove('active'));
        element.classList.add('active');
    }
}

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

function openProductDetail(id) {
    const product = productsData.find(p => p.id === id);
    if (!product) return;
    const discount = Math.round(((product.originalPrice - product.currentPrice) / product.originalPrice) * 100);
    
    let stockHtml = `<span style="color: #388e3c; font-weight: 600;"><i class="fas fa-box"></i> In Stock (${product.stock} left)</span>`;
    let buyBtnHtml = `<button onclick="openCheckoutPage(${product.id})" style="flex: 1; background: #ffd814; color: #111; border: none; padding: 15px; font-weight: 600; cursor: pointer;">Buy now</button>`;

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

function openCheckoutPage(id) {
    const product = productsData.find(p => p.id === id);
    if (!product || product.stock <= 0) {
        alert("Sorry, this item is out of stock!");
        return;
    }

    let checkoutPage = document.getElementById('checkout-page-container');
    if (!checkoutPage) {
        checkoutPage = document.createElement('div');
        checkoutPage.id = 'checkout-page-container';
        checkoutPage.style = "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #f8f9fa; z-index: 10000; overflow-y: auto; display: none;";
        document.body.appendChild(checkoutPage);
    }

    checkoutPage.style.display = 'block';
    checkoutPage.innerHTML = `
        <div style="background: #fff; min-height: 100vh; padding-bottom: 50px;">
            <div style="padding: 15px; display: flex; align-items: center; border-bottom: 1px solid #eee; background: #fff; position: sticky; top: 0; z-index: 10;">
                <button onclick="document.getElementById('checkout-page-container').style.display='none'" style="background: none; border: none; font-size: 1.2rem; cursor: pointer;"><i class="fas fa-arrow-left"></i></button>
                <span style="font-weight: 600; margin-left: 15px; font-size: 1rem;">Checkout & Delivery</span>
            </div>

            <div style="padding: 15px; max-width: 600px; margin: auto;">
                <div style="background: #fff; padding: 12px; border-radius: 12px; border: 1px solid #eee; display: flex; gap: 12px; align-items: center; margin-bottom: 15px;">
                    <img src="${product.image}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
                    <div>
                        <div style="font-weight: 700; font-size: 0.95rem;">${product.name}</div>
                        <div style="font-size: 0.9rem; color: #111; font-weight: 700; margin-top: 3px;">₹${product.currentPrice}</div>
                    </div>
                </div>

                <div style="background: #fff; padding: 15px; border-radius: 12px; border: 1px solid #eee; margin-bottom: 15px;">
                    <div style="font-weight: 700; font-size: 0.95rem; margin-bottom: 12px; color: #111;"><i class="fas fa-user" style="color: #2874f0; margin-right: 8px;"></i> Customer Details</div>
                    
                    <div style="margin-bottom: 12px;">
                        <label style="font-size: 0.8rem; color: #666; display: block; margin-bottom: 4px;">Full Name</label>
                        <input type="text" id="chk-name" value="${loggedInUser.name}" style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 8px; font-size: 0.85rem;">
                    </div>

                    <div style="margin-bottom: 12px;">
                        <label style="font-size: 0.8rem; color: #666; display: block; margin-bottom: 4px;">Phone Number</label>
                        <input type="tel" id="chk-phone" placeholder="Enter mobile number" style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 8px; font-size: 0.85rem;">
                    </div>

                    <div style="margin-bottom: 12px;">
                        <label style="font-size: 0.8rem; color: #666; display: block; margin-bottom: 4px;">Delivery Address</label>
                        <textarea id="chk-address" placeholder="House no, Street, City..." style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 8px; font-size: 0.85rem; height: 60px;"></textarea>
                    </div>

                    <div style="margin-bottom: 5px;">
                        <label style="font-size: 0.8rem; color: #666; display: block; margin-bottom: 4px;">Distance (in KM)</label>
                        <input type="number" id="chk-distance" value="1" min="1" oninput="updateTotals(${product.currentPrice})" style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 8px; font-size: 0.85rem;">
                    </div>
                </div>

                <div style="background: #fffdf0; padding: 12px; border-radius: 12px; border: 1px solid #e2d3b3; margin-bottom: 15px;">
                    <label style="display: flex; align-items: center; gap: 10px; font-size: 0.85rem; font-weight: 600; cursor: pointer;">
                        <input type="checkbox" id="extra-coin-check" onchange="updateTotals(${product.currentPrice})" style="width: 16px; height: 16px;"> Pay ₹5 extra and get 10 Zuri Coins
                    </label>
                </div>

                <div style="background: #fff; padding: 15px; border-radius: 12px; border: 1px solid #eee; margin-bottom: 15px;">
                    <div style="font-weight: 700; font-size: 0.95rem; margin-bottom: 12px; color: #111;"><i class="fas fa-wallet" style="color: #2874f0; margin-right: 8px;"></i> Payment Method</div>
                    <label style="display: flex; align-items: center; gap: 10px; font-size: 0.85rem; margin-bottom: 10px; cursor: pointer;">
                        <input type="radio" name="pay-method" value="COD" checked onchange="updateTotals(${product.currentPrice})"> Cash on Delivery (COD - ₹13 extra fee)
                    </label>
                    <label style="display: flex; align-items: center; gap: 10px; font-size: 0.85rem; cursor: pointer;">
                        <input type="radio" name="pay-method" value="UPI" onchange="updateTotals(${product.currentPrice})"> UPI / Online Payment
                    </label>
                </div>

                <div style="background: #fdf8f0; padding: 15px; border-radius: 12px; border: 1px solid #f9eac7; margin-bottom: 20px; font-size: 0.85rem;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 6px;"><span>Item Price:</span> <span>₹${product.currentPrice}</span></div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 6px;"><span>Delivery Charge (₹10/km):</span> <span id="summary-delivery">₹10</span></div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 6px;"><span>COD Fee:</span> <span id="summary-cod">₹13</span></div>
                    <hr style="margin: 8px 0; border: none; border-top: 1px solid #e2d3b3;">
                    <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 1rem; color: #111;"><span>Total Payable:</span> <span id="summary-total">₹${product.currentPrice + 10 + 13}</span></div>
                </div>

                <button onclick="finalizeOrder(${product.id})" style="width: 100%; background: #ffd814; color: #111; border: none; padding: 15px; border-radius: 8px; font-weight: 700; font-size: 1rem; cursor: pointer; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">Place Order Now</button>
            </div>
        </div>
    `;
}

function updateTotals(basePrice) {
    const km = parseInt(document.getElementById('chk-distance').value) || 1;
    const delivery = km * 10;
    const payMethod = document.querySelector('input[name="pay-method"]:checked').value;
    const isExtraCoin = document.getElementById('extra-coin-check').checked;

    let codFee = (payMethod === 'COD') ? 13 : 0;
    let extraFee = isExtraCoin ? 5 : 0;
    let total = basePrice + delivery + codFee + extraFee;

    document.getElementById('summary-delivery').innerText = `₹${delivery}`;
    document.getElementById('summary-cod').innerText = `₹${codFee}`;
    document.getElementById('summary-total').innerText = `₹${total}`;
}

function finalizeOrder(id) {
    const product = productsData.find(p => p.id === id);
    const name = document.getElementById('chk-name').value;
    const phone = document.getElementById('chk-phone').value;
    const address = document.getElementById('chk-address').value;
    const distance = parseInt(document.getElementById('chk-distance').value) || 1;
    const payMethod = document.querySelector('input[name="pay-method"]:checked').value;
    const isExtraCoin = document.getElementById('extra-coin-check').checked;

    if (!name || !phone || !address) {
        alert("Please fill in your Name, Phone Number, and Delivery Address!");
        return;
    }

    if (product && product.stock > 0) {
        product.stock--;
        const deliveryCharge = distance * 10;
        let codFee = (payMethod === 'COD') ? 13 : 0;
        let extraFee = isExtraCoin ? 5 : 0;
        let totalAmount = product.currentPrice + deliveryCharge + codFee + extraFee;

        let earnedCoins = isExtraCoin ? 10 : 0;
        zuriCoins += earnedCoins;
        loggedInUser.phone = phone;

        const newOrder = {
            id: Date.now(),
            productName: product.name,
            image: product.image,
            price: totalAmount,
            address: address,
            phone: phone,
            payment: payMethod,
            statusIndex: 0,
            date: new Date().toLocaleDateString()
        };

        userOrders.push(newOrder);
        
        localStorage.setItem('zuri_orders', JSON.stringify(userOrders));
        localStorage.setItem('zuri_coins', zuriCoins);

        const waMessage = `New Order Placed!%0A*Product:* ${encodeURIComponent(product.name)}%0A*Customer:* ${encodeURIComponent(name)}%0A*Phone:* ${encodeURIComponent(phone)}%0A*Address:* ${encodeURIComponent(address)}%0A*Payment:* ${payMethod}%0A*Total:* ₹${totalAmount}`;
        const waUrl = `https://wa.me/918910377745?text=${waMessage}`;

        alert(`Order placed successfully!\nTotal: ₹${totalAmount}\nZuri Coins Earned: ${earnedCoins}`);
        
        window.open(waUrl, '_blank');

        document.getElementById('checkout-page-container').style.display = 'none';
        closeProductDetail();
        loadHomeProducts();
        loadCategoryProducts();
        loadOrders();
        showDashboard();
    } else {
        alert("Sorry, this item is out of stock!");
    }
}

function loadOrders() {
    const ordersSection = document.getElementById('orders-section');
    if (!ordersSection) return;

    const statuses = ["Ordered", "Shipped", "Out for Delivery", "Delivered"];

    if (userOrders.length === 0) {
        ordersSection.innerHTML = `
            <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 12px;">My Orders</h3>
            <div style="background: #fff; padding: 20px; border-radius: 12px; text-align: center; color: #666; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                <i class="fas fa-box-open" style="font-size: 2rem; color: #d4af37; margin-bottom: 10px;"></i>
                <p>You have no active orders yet.</p>
            </div>
        `;
    } else {
        ordersSection.innerHTML = `
            <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 12px;">My Orders (${userOrders.length})</h3>
            <div style="display: flex; flex-direction: column; gap: 15px;">
                ${userOrders.map((ord, idx) => `
                    <div style="background: #fff; padding: 15px; border-radius: 12px; box-shadow: 0 1px 4px rgba(0,0,0,0.05);">
                        <div style="display: flex; gap: 12px; align-items: center; margin-bottom: 12px;">
                            <img src="${ord.image}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
                            <div style="flex: 1;">
                                <div style="font-weight: 700; font-size: 0.95rem; color: #111;">${ord.productName}</div>
                                <div style="font-size: 0.8rem; color: #555; margin-top: 2px;">Total: <b>₹${ord.price}</b> (${ord.payment})</div>
                                <div style="font-size: 0.75rem; color: #666;"><i class="fas fa-map-marker-alt" style="color: #d4af37;"></i> ${ord.address} (Ph:${ord.phone})</div>
                            </div>
                        </div>

                        <div style="background: #f8f9fa; padding: 10px; border-radius: 8px;">
                            <div style="font-size: 0.75rem; font-weight: 700; color: #333; margin-bottom: 8px;">Order Tracking Status:</div>
                            <div style="display: flex; justify-content: space-between; position: relative; text-align: center;">
                                ${statuses.map((stat, sIdx) => `
                                    <div style="z-index: 2; flex: 1; cursor: pointer;" onclick="updateOrderStatus(${idx})">
                                        <div style="width: 22px; height: 22px; background: ${sIdx <= ord.statusIndex ? '#388e3c' : '#ccc'}; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; margin: auto; font-weight: bold;">${sIdx <= ord.statusIndex ? '✓' : sIdx + 1}</div>
                                        <div style="font-size: 0.65rem; color: ${sIdx <= ord.statusIndex ? '#388e3c' : '#888'}; margin-top: 4px; font-weight: ${sIdx === ord.statusIndex ? '700' : '400'};">${stat}</div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
}

function updateOrderStatus(index) {
    if (userOrders[index].statusIndex < 3) {
        userOrders[index].statusIndex++;
    } else {
        userOrders[index].statusIndex = 0;
    }
    localStorage.setItem('zuri_orders', JSON.stringify(userOrders));
    loadOrders();
}

function showWalletInfo() {
    alert(`⭐ Zuri Coins Wallet & Rewards ⭐\n\n- Balance: ${zuriCoins} Coins\n- Earn 10 Coins by paying ₹5 extra during checkout.\n- Redeem 100 Zuri Coins to get 70% OFF on any product!\n\nKeep shopping to earn more rewards!`);
}

// সেভড পেমেন্ট মেথড পেজ (ইউপিআই ও কার্ড অপশন সহ)
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
                <div style="background: #fff; padding: 15px; border-radius: 12px; margin-bottom: 15px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                    <div style="font-weight: 700; font-size: 0.95rem; margin-bottom: 10px; color: #111;"><i class="fas fa-mobile-alt" style="color: #2874f0; margin-right: 8px;"></i> Add UPI ID</div>
                    <input type="text" placeholder="Enter UPI ID (e.g., username@oksbi)" style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 8px; font-size: 0.85rem; outline: none; margin-bottom: 10px;">
                    <button onclick="alert('UPI ID saved successfully!')" style="background: #2874f0; color: #fff; border: none; padding: 10px 15px; border-radius: 8px; font-weight: 600; font-size: 0.85rem; cursor: pointer;">Save UPI ID</button>
                </div>

                <div style="background: #fff; padding: 15px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                    <div style="font-weight: 700; font-size: 0.95rem; margin-bottom: 10px; color: #111;"><i class="fas fa-credit-card" style="color: #2874f0; margin-right: 8px;"></i> Add Credit / Debit Card</div>
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

// টার্মস অ্যান্ড কন্ডিশন পেজ
function openTermsConditions() {
    let termsModal = document.getElementById('terms-conditions-page');
    if (!termsModal) {
        termsModal = document.createElement('div');
        termsModal.id = 'terms-conditions-page';
        termsModal.style = "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #f8f9fa; z-index: 9999; overflow-y: auto; display: none;";
        document.body.appendChild(termsModal);
    }
    
    termsModal.style.display = 'block';
    termsModal.innerHTML = `
        <div style="background: #fff; min-height: 100vh; padding-bottom: 40px;">
            <div style="padding: 15px; display: flex; align-items: center; border-bottom: 1px solid #eee; background: #fff; position: sticky; top: 0; z-index: 10;">
                <button onclick="document.getElementById('terms-conditions-page').style.display='none'" style="background: none; border: none; font-size: 1.2rem; cursor: pointer;"><i class="fas fa-arrow-left"></i></button>
                <span style="font-weight: 600; margin-left: 15px; font-size: 1rem;">Terms & Conditions</span>
            </div>
            
            <div style="padding: 20px; font-size: 0.9rem; color: #444; line-height: 1.6;">
                <h3 style="margin-bottom: 10px; color: #111;">Zuri Luxury Store Policies</h3>
                <p style="margin-bottom: 12px;">1. <b>Order Cancellation:</b> Once an order is successfully placed and confirmed, it cannot be cancelled or modified under any circumstances.</p>
                <p style="margin-bottom: 12px;">2. <b>Return & Refund Policy:</b> Due to the delicate and handmade nature of our luxury jewelry collection, we strictly have <b>no return or refund</b> policy. All sales are final.</p>
                <p style="margin-bottom: 12px;">3. <b>Delivery & Charges:</b> Delivery charges are calculated based on the distance from our store (₹10/km). COD orders carry an additional handling fee of ₹13.</p>
                <p>4. <b>Zuri Coins:</b> Coins earned through special checkout options can be redeemed as per the store's active reward guidelines.</p>
            </div>
        </div>
    `;
}

function showDashboard() {
    const profileDashboard = document.getElementById('profile-dashboard');
    if (!profileDashboard) return;

    profileDashboard.innerHTML = `
        <div style="background: #f1f3f6; min-height: 100vh; padding-bottom: 60px; position: relative;">
            <div style="background: #fff; padding: 15px 20px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 1px 3px rgba(0,0,0,0.05); position: sticky; top: 0; z-index: 10;">
                <h2 style="font-size: 1.2rem; font-weight: 700; color: #111; margin: 0;"><i class="fas fa-user-circle" style="color: #2874f0; margin-right: 8px;"></i> Hey, ${loggedInUser.name}</h2>
                <button onclick="window.open('https://wa.me/918910377745?text=Hello%20Zuri%20Team,%20I%20need%20help', '_blank')" style="background: #fff; border: 1px solid #ccc; border-radius: 20px; padding: 5px 12px; font-size: 0.8rem; font-weight: 600; display: flex; align-items: center; gap: 5px; cursor: pointer;">
                    <i class="fas fa-headset" style="color: #2874f0;"></i> Help
                </button>
            </div>

            <div style="padding: 12px;">
                <div style="background: linear-gradient(135deg, #1a1a1a, #333333); color: #fff; padding: 18px; border-radius: 12px; margin-bottom: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.15); border: 1px solid #d4af37;">
                    <div style="font-size: 0.8rem; color: #d4af37; font-weight: 600; letter-spacing: 1px;">ZURI COINS WALLET</div>
                    <div style="font-size: 1.3rem; font-weight: 700; margin-top: 8px; display: flex; justify-content: space-between; align-items: center;">
                        <span><i class="fas fa-coins" style="color: #ffd700;"></i> ${zuriCoins} Coins Available</span>
                        <span style="font-size: 0.75rem; background: rgba(212, 175, 55, 0.2); color: #ffd700; padding: 5px 12px; border-radius: 6px; cursor: pointer; font-weight: 600;" onclick="showWalletInfo()">View Wallet</span>
                    </div>
                </div>

                <div style="display: flex; gap: 12px; margin-bottom: 12px;">
                    <div style="flex: 1; background: #fff; padding: 15px; border-radius: 12px; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,0.05); cursor: pointer;" onclick="switchTab('orders-section', document.querySelectorAll('.bottom-nav .nav-item')[1])">
                        <i class="fas fa-box" style="font-size: 1.3rem; color: #2874f0; margin-bottom: 5px;"></i>
                        <div style="font-weight: 600; font-size: 0.9rem;">Orders (${userOrders.length})</div>
                    </div>
                    <div style="flex: 1; background: #fff; padding: 15px; border-radius: 12px; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,0.05); cursor: pointer;" onclick="alert('Wishlist is empty')">
                        <i class="fas fa-heart" style="font-size: 1.3rem; color: #ff6161; margin-bottom: 5px;"></i>
                        <div style="font-weight: 600; font-size: 0.9rem;">Wishlist</div>
                    </div>
                </div>

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

                <div style="background: #fff; padding: 15px; border-radius: 12px; margin-bottom: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <span style="font-weight: 700; font-size: 0.95rem;">Ratings & Reviews</span>
                        <span style="color: #2874f0; font-size: 0.85rem; font-weight: 600; cursor: pointer;" onclick="alert('No reviews yet')">View all</span>
                    </div>
                    <div style="background: #fafafa; padding: 12px; border-radius: 8px; font-size: 0.85rem; color: #666; text-align: center;">
                        No ratings given yet
                    </div>
                </div>

                <!-- প্রোফাইল অপশন মেনু (সিকোয়েন্স অনুযায়ী সাজানো) -->
                <div style="background: #fff; border-radius: 12px; overflow: hidden; margin-bottom: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                    <!-- ১. সেভড পেমেন্ট মেথড -->
                    <div style="padding: 14px 15px; border-bottom: 1px solid #f0f0f0; display: flex; justify-content: space-between; align-items: center; font-size: 0.9rem; cursor: pointer;" onclick="openPaymentMethods()">
                        <span><i class="fas fa-wallet" style="color: #2874f0; margin-right: 10px;"></i> Saved payment methods</span>
                        <i class="fas fa-chevron-right" style="color: #bbb; font-size: 0.8rem;"></i>
                    </div>
                    <!-- ২. টার্মস অ্যান্ড কন্ডিশন -->
                    <div style="padding: 14px 15px; display: flex; justify-content: space-between; align-items: center; font-size: 0.9rem; cursor: pointer;" onclick="openTermsConditions()">
                        <span><i class="fas fa-file-contract" style="color: #2874f0; margin-right: 10px;"></i> Terms & Conditions</span>
                        <i class="fas fa-chevron-right" style="color: #bbb; font-size: 0.8rem;"></i>
                    </div>
                </div>

                <!-- ৩. ফলো আস অন (Instagram ও Facebook লোগো সহ) -->
                <div style="background: #fff; padding: 15px; border-radius: 12px; text-align: center; margin-bottom: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                    <div style="font-weight: 700; font-size: 0.9rem; margin-bottom: 12px; color: #333;">Follow Us On</div>
                    <div style="display: flex; justify-content: center; gap: 20px;">
                        <a href="https://www.instagram.com/zuri.jewelers?xtok=NXB0dnpjdHRqZ2g=" target="_blank" style="width: 45px; height: 45px; background: #f0f0f0; border-radius: 50%; display: flex; justify-content: center; align-items: center; color: #E1306C; font-size: 1.4rem; text-decoration: none; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                            <i class="fab fa-instagram"></i>
                        </a>
                        <a href="https://www.facebook.com/share/1C1rYg4jCP/" target="_blank" style="width: 45px; height: 45px; background: #f0f0f0; border-radius: 50%; display: flex; justify-content: center; align-items: center; color: #1877F2; font-size: 1.4rem; text-decoration: none; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                            <i class="fab fa-facebook-f"></i>
                        </a>
                    </div>
                </div>

                <!-- ৪. একদম নিচে লগআউট বাটন -->
                <button onclick="location.reload();" style="width: 100%; background: #fff; border: 1px solid #2874f0; color: #2874f0; padding: 12px; border-radius: 8px; font-weight: 700; cursor: pointer; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                    <i class="fas fa-sign-out-alt" style="margin-right: 5px;"></i> Log out
                </button>
            </div>

            <a href="https://wa.me/918910377745?text=Hello%20Zuri%20Team" target="_blank" style="position: fixed; bottom: 85px; right: 20px; background: #25d366; color: #fff; width: 50px; height: 50px; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-size: 1.6rem; box-shadow: 0 4px 10px rgba(0,0,0,0.2); z-index: 999; text-decoration: none;">
                <i class="fab fa-whatsapp"></i>
            </a>
        </div>
    `;
}
