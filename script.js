/**
 * Thai Food Tracking System
 * Professional JavaScript implementation
 */

// Translation data
const translations = {
    th: {
        title: "POOH - ระบบติดตามอาหาร",
        menu: "📋 เมนูอาหาร",
        orderList: "🛒 รายการสั่งอาหาร",
        emptyOrder: "ยังไม่มีรายการอาหาร<br>กรุณาเลือกเมนูที่ต้องการ",
        itemCount: "จำนวนรายการ:",
        totalPrice: "ยอดรวมทั้งหมด:",
        confirmBtn: "ยืนยันคำสั่งซื้อ",
        baht: "บาท",
        removeBtn: "ลบ",
        successMessage: "✅ ยืนยันคำสั่งซื้อสำเร็จ!",
        orderNumber: "หมายเลขคำสั่งซื้อ:",
        waitMessage: "กรุณารอสักครู่ อาหารจะเสิร์ฟในไม่ช้า",
        infoTitle: "📦 ข้อมูลร้านอาหาร",
        contactTitle: "ติดต่อสอบถาม",
        contactText: "เบอร์โทรศัพท์: 02-xxx-xxxx<br>Line: @pooh-shop",
        hoursTitle: "เวลาทำการ",
        hoursText: "จันทร์ - เสาร์<br>08:00 - 18:00 น.",
        deliveryTitle: "บริการจัดส่ง",
        deliveryText: "จัดส่งฟรี!<br>สั่งซื้อขั้นต่ำ 500 บาท",
        promoTitle: "🎉 โปรโมชั่นพิเศษ",
        promoText: "พิจารณาร้านอาหารของเราเพื่อซื้อความสะดวกสบายและคุณภาพที่ดีที่สุด สินค้าสดใหม่ทุกวัน จากฟาร์มคัดสรรชั้นเลิศ",
        feature1: "เนื้อหมูคุณภาพจากฟาร์มมาตรฐาน",
        feature2: "ตรวจสอบคุณภาพทุกขั้นตอน",
        feature3: "บริการจัดส่งรวดเร็วทันใจ",
        aboutTitle: "เกี่ยวกับเรา",
        aboutText: "POOH - ร้านอาหารคุณภาพ ส่งตรงถึงบ้านคุณ<br>ด้วยสินค้าสดใหม่และคุณภาพดีที่สุด",
        contactUsTitle: "ติดต่อเรา",
        contactUsText: "📞 โทร: 02-xxx-xxxx<br>📧 อีเมล: contact@pooh-shop.com<br>📍 ที่อยู่: กรุงเทพมหานคร",
        workingHoursTitle: "เวลาทำการ",
        workingHoursText: "จันทร์ - ศุกร์: 08:00 - 18:00<br>เสาร์: 09:00 - 17:00<br>อาทิตย์: ปิดทำการ",
        copyright: "&copy; 2024 POOH Food Shop. All rights reserved.",
        // Navigation
        navNew: "เนื้อหมูสดใหม่",
        navSausage: "แหนม",
        navSaiGrog: "ไส้กรอก",
        navLukChin: "ลูกชิ้น",
        navOther: "หมูยอ",
        navOrder: "สั่งซื้อเร็ว!",
        // Categories
        categoryNew: "เนื้อหมูสดใหม่",
        categorySausage: "แหนม",
        categorySaiGrog: "ไส้กรอก",
        categoryLukChin: "ลูกชิ้น",
        categoryOther: "หมูยอ",
        // Product names
        product1: "เนื้อหมูกระสำชาด",
        product2: "หมูสามชั้น",
        product3: "สเต็กหมู",
        product4: "แหนมหมู",
        product5: "แหนมเนื้อ",
        product7: "ไส้กรอกหมู",
        product8: "ไส้กรอกเนื้อ",
        product9: "ลูกชิ้นหมู",
        product10: "ลูกชิ้นเนื้อ",
        product11: "หมูยอ",
        product13: "สเต็กหมูติดกระดูก",
        product14: "ไส้กรอกเนื้อเผ็ด",
        perKg: "/กก."
    },
    ru: {
        title: "POOH - Система отслеживания еды",
        menu: "📋 Меню",
        orderList: "🛒 Список заказов",
        emptyOrder: "Заказов пока нет<br>Пожалуйста, выберите блюда",
        itemCount: "Количество товаров:",
        totalPrice: "Итого:",
        confirmBtn: "Подтвердить заказ",
        baht: "бат",
        removeBtn: "Удалить",
        successMessage: "✅ Заказ успешно подтвержден!",
        orderNumber: "Номер заказа:",
        waitMessage: "Пожалуйста, подождите, еда скоро будет подана",
        infoTitle: "📦 Информация о ресторане",
        contactTitle: "Связаться с нами",
        contactText: "Телефон: 02-xxx-xxxx<br>Line: @pooh-shop",
        hoursTitle: "Часы работы",
        hoursText: "Понедельник - Суббота<br>08:00 - 18:00",
        deliveryTitle: "Доставка",
        deliveryText: "Бесплатная доставка!<br>Минимальный заказ 500 бат",
        promoTitle: "🎉 Специальные предложения",
        promoText: "Посетите наш ресторан для максимального удобства и качества. Свежие продукты каждый день, отборные с лучших ферм",
        feature1: "Качественная свинина с сертифицированных ферм",
        feature2: "Контроль качества на каждом этапе",
        feature3: "Быстрая доставка",
        aboutTitle: "О нас",
        aboutText: "POOH - Качественный ресторан с доставкой на дом<br>Со свежими продуктами высочайшего качества",
        contactUsTitle: "Свяжитесь с нами",
        contactUsText: "📞 Тел: 02-xxx-xxxx<br>📧 Email: contact@pooh-shop.com<br>📍 Адрес: Бангкок",
        workingHoursTitle: "Часы работы",
        workingHoursText: "Пн - Пт: 08:00 - 18:00<br>Сб: 09:00 - 17:00<br>Вс: Закрыто",
        copyright: "&copy; 2024 POOH Food Shop. Все права защищены.",
        // Navigation
        navNew: "Свежая свинина",
        navSausage: "нэм",
        navSaiGrog: "Сосиски",
        navLukChin: "Фрикадельки",
        navOther: "Специальное",
        navOrder: "Быстрый заказ!",
        // Categories
        categoryNew: "Свежая свинина",
        categorySausage: "нэм",
        categorySaiGrog: "Сосиски",
        categoryLukChin: "Фрикадельки",
        categoryOther: "Специальное",
        // Product names
        product1: "Свинина Красамчад",
        product2: "Свиная грудинка",
        product3: "Свиной стейк",
        product4: "Нэм свиной",
        product5: "Нэм говяжий",
        product7: "Сосиски свиные",
        product8: "Сосиски говяжьи",
        product9: "Свиные фрикадельки",
        product10: "Говяжьи фрикадельки",
        product11: "Свиная ветчина",
        product13: "Стейк на косточке",
        product14: "Острые говяжьи сосиски",
        perKg: "/за кг"
    }
};

class FoodOrderSystem {
    constructor() {
        this.order = {};
        this.orderCounter = 1;
        this.currentLang = localStorage.getItem('language') || 'th';
        this.init();
    }

    init() {
        this.loadDynamicProducts();
        this.updateOrderDisplay();
        this.applyTranslations();
    }

    loadDynamicProducts() {
        // Load products from localStorage if available
        const productsData = localStorage.getItem('products');
        if (!productsData) return;

        const products = JSON.parse(productsData);
        
        // Group products by category
        const categories = {
            'new': document.querySelector('#new .product-grid'),
            'sausage': document.querySelector('#sausage .product-grid'),
            'sai-grog': document.querySelector('#sai-grog .product-grid'),
            'luk-chin': document.querySelector('#luk-chin .product-grid'),
            'other': document.querySelector('#other .product-grid')
        };

        // Clear existing products
        Object.values(categories).forEach(grid => {
            if (grid) grid.innerHTML = '';
        });

        // Add products to their respective categories
        products.forEach(product => {
            const grid = categories[product.category];
            if (!grid) return;

            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.setAttribute('data-id', product.id);
            productCard.setAttribute('data-name', product.nameTh);
            productCard.setAttribute('data-price', product.price);

            const productName = this.currentLang === 'ru' ? product.nameRu : product.nameTh;
            productCard.innerHTML = `
                ${product.image ? `<img src="${this.escapeHtml(product.image)}" alt="${this.escapeHtml(productName)}" class="product-image" onerror="this.style.display='none'">` : ''}
                <div class="product-info">
                    <div class="product-name" data-i18n="product${product.id}">${this.escapeHtml(product.nameTh)}</div>
                    <div class="product-price">฿ ${product.price}.-</div>
                </div>
                <button class="add-btn" onclick="addToOrder(${product.id})">
                    <span class="button-icon">🛒</span>
                </button>
            `;

            grid.appendChild(productCard);

            // Update translations object dynamically
            translations.th[`product${product.id}`] = product.nameTh;
            translations.ru[`product${product.id}`] = product.nameRu;
        });
    }

    addToOrder(itemId) {
        const menuItem = document.querySelector(`[data-id="${itemId}"]`);
        if (!menuItem) return;

        const price = parseFloat(menuItem.getAttribute('data-price'));

        if (this.order[itemId]) {
            this.order[itemId].quantity++;
        } else {
            this.order[itemId] = {
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

    switchLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('language', lang);
        this.applyTranslations();
        this.updateOrderDisplay();
        
        // Update language switcher buttons
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        const targetBtn = document.querySelector(`[data-lang="${lang}"]`);
        if (targetBtn) {
            targetBtn.classList.add('active');
        }
    }

    applyTranslations() {
        const t = translations[this.currentLang];
        
        // Update page title
        document.title = t.title;
        
        // Update all elements with data-i18n attributes
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (t[key]) {
                element.textContent = t[key];
            }
        });
        
        // Update product card data-name attributes for translated order display
        document.querySelectorAll('.product-card').forEach(card => {
            const productId = card.getAttribute('data-id');
            const productKey = `product${productId}`;
            if (t[productKey]) {
                card.setAttribute('data-name', t[productKey]);
            }
        });
        
        // Update info section
        const infoTitle = document.querySelector('.info-section h2');
        if (infoTitle) infoTitle.textContent = t.infoTitle;
        
        const infoCards = document.querySelectorAll('.info-card');
        if (infoCards[0]) {
            infoCards[0].querySelector('.info-title').textContent = t.contactTitle;
            infoCards[0].querySelector('.info-text').innerHTML = t.contactText;
        }
        if (infoCards[1]) {
            infoCards[1].querySelector('.info-title').textContent = t.hoursTitle;
            infoCards[1].querySelector('.info-text').innerHTML = t.hoursText;
        }
        if (infoCards[2]) {
            infoCards[2].querySelector('.info-title').textContent = t.deliveryTitle;
            infoCards[2].querySelector('.info-text').innerHTML = t.deliveryText;
        }
        
        // Update promo section
        const promoTitle = document.querySelector('.promo-banner h3');
        if (promoTitle) promoTitle.textContent = t.promoTitle;
        
        const promoText = document.querySelector('.promo-banner p');
        if (promoText) promoText.textContent = t.promoText;
        
        const features = document.querySelectorAll('.feature-item span:last-child');
        if (features[0]) features[0].textContent = t.feature1;
        if (features[1]) features[1].textContent = t.feature2;
        if (features[2]) features[2].textContent = t.feature3;
        
        // Update footer
        const footerSections = document.querySelectorAll('.footer-section');
        if (footerSections[0]) {
            footerSections[0].querySelector('h4').textContent = t.aboutTitle;
            footerSections[0].querySelector('p').innerHTML = t.aboutText;
        }
        if (footerSections[1]) {
            footerSections[1].querySelector('h4').textContent = t.contactUsTitle;
            footerSections[1].querySelector('p').innerHTML = t.contactUsText;
        }
        if (footerSections[2]) {
            footerSections[2].querySelector('h4').textContent = t.workingHoursTitle;
            footerSections[2].querySelector('p').innerHTML = t.workingHoursText;
        }
        
        const footerBottom = document.querySelector('.footer-bottom p');
        if (footerBottom) footerBottom.innerHTML = t.copyright;
    }

    updateOrderDisplay() {
        const t = translations[this.currentLang];
        const orderList = document.getElementById('orderList');
        const itemCount = document.getElementById('itemCount');
        const totalPrice = document.getElementById('totalPrice');
        const confirmBtn = document.getElementById('confirmBtn');

        if (Object.keys(this.order).length === 0) {
            orderList.innerHTML = `
                <div class="empty-order">
                    ${t.emptyOrder}
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
                
                // Get translated product name
                const productKey = `product${itemId}`;
                const productName = t[productKey] || `Product ${itemId}`;

                html += `
                    <div class="order-item">
                        <div class="order-item-info">
                            <div class="order-item-name">${this.escapeHtml(productName)}</div>
                            <div class="order-item-price">${item.price} ${t.baht} × ${item.quantity} = ${itemTotal} ${t.baht}</div>
                        </div>
                        <div class="quantity-controls">
                            <button class="qty-btn" onclick="orderSystem.updateQuantity(${itemId}, -1)">−</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="qty-btn" onclick="orderSystem.updateQuantity(${itemId}, 1)">+</button>
                            <button class="remove-btn" onclick="orderSystem.removeFromOrder(${itemId})">${t.removeBtn}</button>
                        </div>
                    </div>
                `;
            }

            orderList.innerHTML = html;
            itemCount.textContent = count;
            totalPrice.textContent = `${total} ${t.baht}`;
            confirmBtn.disabled = false;
        }
    }

    confirmOrder() {
        if (Object.keys(this.order).length === 0) return;

        const t = translations[this.currentLang];
        const orderNumber = `${this.currentLang.toUpperCase()}${String(this.orderCounter).padStart(4, '0')}`;
        this.orderCounter++;

        const orderList = document.getElementById('orderList');
        let total = 0;
        for (const item of Object.values(this.order)) {
            total += item.price * item.quantity;
        }

        orderList.innerHTML = `
            <div class="success-message">
                ${t.successMessage}
                <div class="order-number">${t.orderNumber} ${orderNumber}</div>
                <div style="margin-top: 10px; font-size: 0.9em;">
                    ${t.totalPrice} ${total} ${t.baht}
                </div>
                <div style="margin-top: 10px; font-size: 0.9em;">
                    ${t.waitMessage}
                </div>
            </div>
        `;

        this.order = {};
        document.getElementById('itemCount').textContent = '0';
        document.getElementById('totalPrice').textContent = `0 ${t.baht}`;
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
