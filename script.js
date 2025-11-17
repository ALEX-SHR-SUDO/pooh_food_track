/**
 * Thai Food Tracking System
 * Professional JavaScript implementation
 */

class FoodOrderSystem {
    constructor() {
        this.order = {};
        this.orderCounter = 1;
        this.init();
    }

    init() {
        this.updateOrderDisplay();
    }

    addToOrder(itemId) {
        const menuItem = document.querySelector(`[data-id="${itemId}"]`);
        if (!menuItem) return;

        const name = menuItem.getAttribute('data-name');
        const price = parseFloat(menuItem.getAttribute('data-price'));

        if (this.order[itemId]) {
            this.order[itemId].quantity++;
        } else {
            this.order[itemId] = {
                name: name,
                price: price,
                quantity: 1
            };
        }

        this.updateOrderDisplay();
    }

    removeFromOrder(itemId) {
        delete this.order[itemId];
        this.updateOrderDisplay();
    }

    updateQuantity(itemId, change) {
        if (this.order[itemId]) {
            this.order[itemId].quantity += change;
            if (this.order[itemId].quantity <= 0) {
                delete this.order[itemId];
            }
            this.updateOrderDisplay();
        }
    }

    updateOrderDisplay() {
        const orderList = document.getElementById('orderList');
        const itemCount = document.getElementById('itemCount');
        const totalPrice = document.getElementById('totalPrice');
        const confirmBtn = document.getElementById('confirmBtn');

        if (Object.keys(this.order).length === 0) {
            orderList.innerHTML = `
                <div class="empty-order">
                    ยังไม่มีรายการอาหาร<br>กรุณาเลือกเมนูที่ต้องการ
                </div>
            `;
            confirmBtn.disabled = true;
        } else {
            let html = '';
            let total = 0;
            let count = 0;

            for (const [itemId, item] of Object.entries(this.order)) {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                count += item.quantity;

                html += `
                    <div class="order-item">
                        <div class="order-item-info">
                            <div class="order-item-name">${this.escapeHtml(item.name)}</div>
                            <div class="order-item-price">${item.price} บาท × ${item.quantity} = ${itemTotal} บาท</div>
                        </div>
                        <div class="quantity-controls">
                            <button class="qty-btn" onclick="orderSystem.updateQuantity(${itemId}, -1)">−</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="qty-btn" onclick="orderSystem.updateQuantity(${itemId}, 1)">+</button>
                            <button class="remove-btn" onclick="orderSystem.removeFromOrder(${itemId})">ลบ</button>
                        </div>
                    </div>
                `;
            }

            orderList.innerHTML = html;
            itemCount.textContent = count;
            totalPrice.textContent = `${total} บาท`;
            confirmBtn.disabled = false;
        }
    }

    confirmOrder() {
        if (Object.keys(this.order).length === 0) return;

        const orderNumber = `TH${String(this.orderCounter).padStart(4, '0')}`;
        this.orderCounter++;

        const orderList = document.getElementById('orderList');
        let total = 0;
        for (const item of Object.values(this.order)) {
            total += item.price * item.quantity;
        }

        orderList.innerHTML = `
            <div class="success-message">
                ✅ ยืนยันคำสั่งซื้อสำเร็จ!
                <div class="order-number">หมายเลขคำสั่งซื้อ: ${orderNumber}</div>
                <div style="margin-top: 10px; font-size: 0.9em;">
                    ยอดรวม: ${total} บาท
                </div>
                <div style="margin-top: 10px; font-size: 0.9em;">
                    กรุณารอสักครู่ อาหารจะเสิร์ฟในไม่ช้า
                </div>
            </div>
        `;

        this.order = {};
        document.getElementById('itemCount').textContent = '0';
        document.getElementById('totalPrice').textContent = '0 บาท';
        document.getElementById('confirmBtn').disabled = true;

        setTimeout(() => {
            this.updateOrderDisplay();
        }, 5000);
    }

    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
}

// Initialize the order system
let orderSystem;
document.addEventListener('DOMContentLoaded', () => {
    orderSystem = new FoodOrderSystem();
});

// Legacy function wrappers for backward compatibility
function addToOrder(itemId) {
    orderSystem.addToOrder(itemId);
}

function removeFromOrder(itemId) {
    orderSystem.removeFromOrder(itemId);
}

function updateQuantity(itemId, change) {
    orderSystem.updateQuantity(itemId, change);
}

function confirmOrder() {
    orderSystem.confirmOrder();
}
