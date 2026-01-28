/**
 * Admin Panel JavaScript
 * Product Management System
 */

// Translation data for admin panel
const adminTranslations = {
    th: {
        adminLogin: "เข้าสู่ระบบผู้ดูแล",
        password: "รหัสผ่าน:",
        loginBtn: "เข้าสู่ระบบ",
        logoutBtn: "ออกจากระบบ",
        hint: "คำใบ้: รหัสผ่านเริ่มต้นคือ admin123",
        adminTitle: "แผงควบคุมการจัดการสินค้า",
        addProductTitle: "เพิ่มสินค้าใหม่",
        productName: "ชื่อสินค้า (ไทย):",
        productNameRu: "ชื่อสินค้า (รัสเซีย):",
        productPrice: "ราคา (บาท):",
        productCategory: "หมวดหมู่:",
        productImage: "URL รูปภาพ (ไม่บังคับ):",
        addBtn: "➕ เพิ่มสินค้า",
        productListTitle: "สินค้าปัจจุบัน",
        filterBy: "กรองตามหมวดหมู่:",
        all: "ทั้งหมด",
        editProductTitle: "แก้ไขสินค้า",
        saveBtn: "💾 บันทึกการเปลี่ยนแปลง",
        cancelBtn: "ยกเลิก",
        deleteBtn: "🗑️ ลบ",
        editBtn: "✏️ แก้ไข",
        confirmDelete: "คุณแน่ใจหรือไม่ว่าต้องการลบสินค้านี้?",
        productAdded: "✅ เพิ่มสินค้าสำเร็จ!",
        productUpdated: "✅ อัปเดตสินค้าสำเร็จ!",
        productDeleted: "✅ ลบสินค้าสำเร็จ!",
        loginError: "❌ รหัสผ่านไม่ถูกต้อง!",
        loginSuccess: "✅ เข้าสู่ระบบสำเร็จ!",
        noProducts: "ไม่มีสินค้าในหมวดหมู่นี้",
        categoryNew: "เนื้อหมูสดใหม่",
        categorySausage: "แหนม",
        categorySaiGrog: "ไส้กรอก",
        categoryLukChin: "ลูกชิ้น",
        categoryOther: "ค้านนากา"
    },
    ru: {
        adminLogin: "Вход администратора",
        password: "Пароль:",
        loginBtn: "Войти",
        logoutBtn: "Выйти",
        hint: "Подсказка: Пароль по умолчанию - admin123",
        adminTitle: "Панель управления товарами",
        addProductTitle: "Добавить новый товар",
        productName: "Название товара (Тайский):",
        productNameRu: "Название товара (Русский):",
        productPrice: "Цена (бат):",
        productCategory: "Категория:",
        productImage: "URL изображения (опционально):",
        addBtn: "➕ Добавить товар",
        productListTitle: "Текущие товары",
        filterBy: "Фильтр по категории:",
        all: "Все",
        editProductTitle: "Редактировать товар",
        saveBtn: "💾 Сохранить изменения",
        cancelBtn: "Отмена",
        deleteBtn: "🗑️ Удалить",
        editBtn: "✏️ Редактировать",
        confirmDelete: "Вы уверены, что хотите удалить этот товар?",
        productAdded: "✅ Товар успешно добавлен!",
        productUpdated: "✅ Товар успешно обновлен!",
        productDeleted: "✅ Товар успешно удален!",
        loginError: "❌ Неверный пароль!",
        loginSuccess: "✅ Вход выполнен успешно!",
        noProducts: "Нет товаров в этой категории",
        categoryNew: "Свежая свинина",
        categorySausage: "нэм",
        categorySaiGrog: "Сосиски",
        categoryLukChin: "Фрикадельки",
        categoryOther: "Специальное"
    }
};

class AdminSystem {
    constructor() {
        this.currentLang = localStorage.getItem('language') || 'th';
        this.isAuthenticated = sessionStorage.getItem('adminAuth') === 'true';
        this.defaultPassword = 'admin123'; // In production, this should be secured
        this.init();
    }

    init() {
        this.initializeProducts();
        this.applyTranslations();
        
        if (this.isAuthenticated) {
            this.showAdminPanel();
            this.loadProducts();
        } else {
            this.showLoginSection();
        }
    }

    initializeProducts() {
        // Initialize with default products if none exist
        if (!localStorage.getItem('products')) {
            const defaultProducts = [
                { id: 1, nameTh: "เนื้อหมูกระสำชาด", nameRu: "Свинина Красамчад", price: 180, category: "new", image: "image/miaso.png" },
                { id: 2, nameTh: "หมูสามชั้นสเต็ก", nameRu: "Стейк из свиной грудинки", price: 75, category: "new", image: "" },
                { id: 3, nameTh: "เนื้อสำเน่า", nameRu: "Свинина Самнао", price: 75, category: "new", image: "" },
                { id: 4, nameTh: "ลูกชิน หมูมหาไทร", nameRu: "Фрикадельки Свиные Махатай", price: 111, category: "sausage", image: "" },
                { id: 5, nameTh: "ลูกชิน หมูมหาไทร", nameRu: "Фрикадельки Свиные Махатай", price: 95, category: "sausage", image: "" },
                { id: 6, nameTh: "แกนตะเปลืองสีกะอา", nameRu: "Колбаски Сикао", price: 85, category: "sausage", image: "" },
                { id: 7, nameTh: "1 - po zene 10 bath", nameRu: "1 - по цене 10 бат", price: 10, category: "sai-grog", image: "" },
                { id: 8, nameTh: "2 - po zene 20 bath", nameRu: "2 - по цене 20 бат", price: 20, category: "sai-grog", image: "" },
                { id: 9, nameTh: "1 - po zene 10 bath", nameRu: "1 - по цене 10 бат", price: 10, category: "luk-chin", image: "" },
                { id: 10, nameTh: "2 - po zene 20 bath", nameRu: "2 - по цене 20 бат", price: 20, category: "luk-chin", image: "" },
                { id: 11, nameTh: "ค้านนากาหั่นบาง", nameRu: "Канака нарезанная тонко", price: 140, category: "other", image: "" },
                { id: 12, nameTh: "ค้านนากาพิเศษ", nameRu: "Канака специальная", price: 170, category: "other", image: "" }
            ];
            localStorage.setItem('products', JSON.stringify(defaultProducts));
            localStorage.setItem('nextProductId', '13');
        }
    }

    switchLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('language', lang);
        this.applyTranslations();
        this.loadProducts();
        
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
        const t = adminTranslations[this.currentLang];
        
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (t[key]) {
                element.textContent = t[key];
            }
        });
        
        // Update select options
        document.querySelectorAll('[data-i18n-option]').forEach(option => {
            const key = option.getAttribute('data-i18n-option');
            if (t[key]) {
                option.textContent = t[key];
            }
        });
    }

    login(event) {
        event.preventDefault();
        const password = document.getElementById('password').value;
        const t = adminTranslations[this.currentLang];
        
        if (password === this.defaultPassword) {
            this.isAuthenticated = true;
            sessionStorage.setItem('adminAuth', 'true');
            this.showMessage(t.loginSuccess, 'success');
            setTimeout(() => {
                this.showAdminPanel();
                this.loadProducts();
            }, 500);
        } else {
            this.showMessage(t.loginError, 'error');
        }
    }

    logout() {
        this.isAuthenticated = false;
        sessionStorage.removeItem('adminAuth');
        this.showLoginSection();
    }

    showLoginSection() {
        document.getElementById('loginSection').style.display = 'flex';
        document.getElementById('adminPanel').style.display = 'none';
    }

    showAdminPanel() {
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
    }

    addProduct(event) {
        event.preventDefault();
        const t = adminTranslations[this.currentLang];
        
        const nameTh = document.getElementById('productName').value.trim();
        const nameRu = document.getElementById('productNameRu').value.trim();
        const price = parseFloat(document.getElementById('productPrice').value);
        const category = document.getElementById('productCategory').value;
        const image = document.getElementById('productImage').value.trim();
        
        const products = this.getProducts();
        const nextId = parseInt(localStorage.getItem('nextProductId') || '1');
        
        const newProduct = {
            id: nextId,
            nameTh: nameTh,
            nameRu: nameRu,
            price: price,
            category: category,
            image: image
        };
        
        products.push(newProduct);
        localStorage.setItem('products', JSON.stringify(products));
        localStorage.setItem('nextProductId', (nextId + 1).toString());
        
        this.showMessage(t.productAdded, 'success');
        event.target.reset();
        this.loadProducts();
    }

    getProducts() {
        const products = localStorage.getItem('products');
        return products ? JSON.parse(products) : [];
    }

    loadProducts() {
        const products = this.getProducts();
        const filter = document.getElementById('filterCategory')?.value || 'all';
        const productList = document.getElementById('productList');
        const t = adminTranslations[this.currentLang];
        
        if (!productList) return;
        
        const filteredProducts = filter === 'all' 
            ? products 
            : products.filter(p => p.category === filter);
        
        if (filteredProducts.length === 0) {
            productList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📦</div>
                    <div class="empty-state-text">${t.noProducts}</div>
                </div>
            `;
            return;
        }
        
        productList.innerHTML = filteredProducts.map(product => `
            <div class="product-admin-card">
                <div class="product-id">ID: ${product.id}</div>
                <div class="category-badge">${this.getCategoryName(product.category)}</div>
                <div class="product-name">${this.escapeHtml(this.currentLang === 'th' ? product.nameTh : product.nameRu)}</div>
                <div class="product-name-secondary">${this.escapeHtml(this.currentLang === 'th' ? product.nameRu : product.nameTh)}</div>
                <div class="product-price">฿ ${product.price}.-</div>
                ${product.image ? `<div class="product-image-info">🖼️ ${this.escapeHtml(product.image)}</div>` : '<div class="product-image-info">📷 No image</div>'}
                <div class="product-actions">
                    <button class="btn btn-edit" onclick="adminSystem.openEditModal(${product.id})">
                        <span data-i18n="editBtn">${t.editBtn}</span>
                    </button>
                    <button class="btn btn-danger" onclick="adminSystem.deleteProduct(${product.id})">
                        <span data-i18n="deleteBtn">${t.deleteBtn}</span>
                    </button>
                </div>
            </div>
        `).join('');
    }

    getCategoryName(category) {
        const t = adminTranslations[this.currentLang];
        const categoryMap = {
            'new': t.categoryNew,
            'sausage': t.categorySausage,
            'sai-grog': t.categorySaiGrog,
            'luk-chin': t.categoryLukChin,
            'other': t.categoryOther
        };
        return categoryMap[category] || category;
    }

    filterProducts() {
        this.loadProducts();
    }

    openEditModal(productId) {
        const products = this.getProducts();
        const product = products.find(p => p.id === productId);
        
        if (!product) return;
        
        document.getElementById('editProductId').value = product.id;
        document.getElementById('editProductName').value = product.nameTh;
        document.getElementById('editProductNameRu').value = product.nameRu;
        document.getElementById('editProductPrice').value = product.price;
        document.getElementById('editProductCategory').value = product.category;
        document.getElementById('editProductImage').value = product.image;
        
        document.getElementById('editModal').style.display = 'flex';
    }

    closeEditModal() {
        document.getElementById('editModal').style.display = 'none';
        document.getElementById('editProductForm').reset();
    }

    updateProduct(event) {
        event.preventDefault();
        const t = adminTranslations[this.currentLang];
        
        const id = parseInt(document.getElementById('editProductId').value);
        const nameTh = document.getElementById('editProductName').value.trim();
        const nameRu = document.getElementById('editProductNameRu').value.trim();
        const price = parseFloat(document.getElementById('editProductPrice').value);
        const category = document.getElementById('editProductCategory').value;
        const image = document.getElementById('editProductImage').value.trim();
        
        const products = this.getProducts();
        const index = products.findIndex(p => p.id === id);
        
        if (index !== -1) {
            products[index] = {
                id: id,
                nameTh: nameTh,
                nameRu: nameRu,
                price: price,
                category: category,
                image: image
            };
            
            localStorage.setItem('products', JSON.stringify(products));
            this.showMessage(t.productUpdated, 'success');
            this.closeEditModal();
            this.loadProducts();
        }
    }

    deleteProduct(productId) {
        const t = adminTranslations[this.currentLang];
        
        if (!confirm(t.confirmDelete)) {
            return;
        }
        
        const products = this.getProducts();
        const filteredProducts = products.filter(p => p.id !== productId);
        
        localStorage.setItem('products', JSON.stringify(filteredProducts));
        this.showMessage(t.productDeleted, 'success');
        this.loadProducts();
    }

    showMessage(message, type) {
        // Find or create message container
        let messageContainer = document.querySelector('.message');
        if (!messageContainer) {
            messageContainer = document.createElement('div');
            const panel = document.getElementById('adminPanel') || document.getElementById('loginSection');
            if (panel) {
                panel.insertBefore(messageContainer, panel.firstChild);
            }
        }
        
        messageContainer.className = `message message-${type}`;
        messageContainer.textContent = message;
        messageContainer.style.display = 'block';
        
        setTimeout(() => {
            messageContainer.style.display = 'none';
        }, 3000);
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

// Initialize admin system
let adminSystem;
document.addEventListener('DOMContentLoaded', () => {
    adminSystem = new AdminSystem();
});

// Close modal when clicking outside
window.addEventListener('click', (event) => {
    const modal = document.getElementById('editModal');
    if (event.target === modal) {
        adminSystem.closeEditModal();
    }
});
