# ร้านอาหารไทยพื้นบ้าน - ระบบติดตามอาหาร 🍜

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ALEX-SHR-SUDO/pooh_food_track)

## คำอธิบาย
เว็บแอปพลิเคชันสำหรับร้านอาหารไทยพื้นบ้าน ที่ช่วยในการติดตามและสั่งอาหารออนไลน์ พัฒนาด้วย HTML, CSS และ JavaScript แบบมืออาชีพ พร้อมการออกแบบที่ใช้สีธงชาติไทย (แดง-ขาว-น้ำเงิน) และองค์ประกอบวัฒนธรรมไทยอย่างมีระดับ

## 🌟 คุณสมบัติ
- 📋 แสดงเมนูอาหารไทยพื้นบ้านหลากหลายประเภท
- 🛒 ระบบตะกร้าสั่งอาหารที่ใช้งานง่าย
- ➕ ➖ ปรับจำนวนอาหารได้สะดวก
- 💰 คำนวณราคารวมอัตโนมัติ
- ✅ ยืนยันคำสั่งซื้อและได้รับหมายเลขคำสั่งซื้อ
- 📱 รองรับการใช้งานบนมือถือ (Responsive Design)
- 🌐 **รองรับหลายภาษา - ไทย และ รัสเซีย (Thai & Russian)**
- 🎨 **ธีมสีธงชาติไทย - แดง ขาว น้ำเงิน และทองคำ**
- 🏛️ **การออกแบบแบบมืออาชีพด้วยองค์ประกอบวัฒนธรรมไทย**
- ✨ **เอฟเฟกต์การโต้ตอบที่ลื่นไหลและทันสมัย**
- 💾 **จัดเก็บข้อมูลด้วย localStorage - ไม่ต้องการ Backend**

## เมนูอาหาร

### อาหารจานหลัก
- ผัดไทย - 45 บาท
- ผัดกะเพรา - 50 บาท
- ข้าวผัด - 40 บาท
- ต้มยำกุ้ง - 80 บาท
- ส้มตำ - 35 บาท

### ก้วยเตี๋ยว
- ก้วยเตี๋ยวน้ำ - 40 บาท
- ก้วยเตี๋ยวต้มยำ - 45 บาท

### เครื่องดื่ม
- น้ำเปล่า - 10 บาท
- ชาเย็น - 20 บาท
- น้ำมะนาว - 25 บาท

## วิธีการใช้งาน

1. เปิดไฟล์ `index.html` ในเว็บเบราว์เซอร์
2. เลือกภาษาที่ต้องการ (ไทย/รัสเซีย) จากปุ่มด้านบน
3. เลือกเมนูอาหารที่ต้องการโดยกดปุ่ม "🌿"
4. ปรับจำนวนอาหารในตะกร้าด้วยปุ่ม + และ -
5. ตรวจสอบยอดรวมทั้งหมด
6. กดปุ่ม "ยืนยันคำสั่งซื้อ" เพื่อทำการสั่งอาหาร
7. รับหมายเลขคำสั่งซื้อและรอรับอาหาร

## 🚀 เทคโนโลยีที่ใช้
- HTML5 (Semantic markup with SEO optimization)
- CSS3 (Gradient, Flexbox, Grid, Animations, Thai-inspired design)
- JavaScript (ES6+ with OOP patterns)
- Professional code structure (separated files)
- Responsive Design
- Vercel deployment ready

## 📁 โครงสร้างโปรเจค
```
pooh_food_track/
├── index.html          # Main HTML file - หน้าหลักสำหรับลูกค้า
├── styles.css          # Professional CSS with Thai theme
├── script.js           # JavaScript with OOP structure - ระบบหลัก
├── image/              # Image directory
│   ├── meat1.png       # Header image
│   └── ...
├── vercel.json         # Vercel deployment configuration
├── README.md           # Project documentation
└── DEPLOYMENT.md       # Vercel deployment guide
```

## 🎨 Thai Cultural Design Elements
- **Thai National Flag Colors**: Red (#A11C23), White, and Blue (#2D376E) from the Thai flag
- **Thai Flag Border Stripes**: Multi-color striped borders at top and bottom representing the flag
- **Professional Gradient Header**: Red-to-Blue gradient inspired by Thai national colors
- **Golden Accents**: Traditional Thai gold (#DAA520) for royal/ceremonial aesthetic
- **Thai Royal Symbols**: ☸ ✦ ๛ decorative elements in header
- **Multi-color Borders**: Gradient borders combining Red, Blue, and Gold
- **Modern Thai Design**: Professional styling with traditional Thai cultural elements
- **Interactive Effects**: Smooth color transitions and hover effects

## 💻 การติดตั้งและใช้งาน

### Local Development
ไม่จำเป็นต้องติดตั้งอะไร เพียงแค่เปิดไฟล์ `index.html` ในเว็บเบราว์เซอร์

หรือใช้ local server:
```bash
# Using Python
python -m http.server 8080

# Using Node.js
npx http-server
```

### Deploy to Vercel
ดูคู่มือการ deploy ที่ [DEPLOYMENT.md](DEPLOYMENT.md)

## 📸 Screenshots
![Thai Food Tracking System](https://github.com/user-attachments/assets/184790d9-fdeb-4529-8c4b-e09e7b3fbff9)
*Main interface with Thai cultural background*

![Order Management](https://github.com/user-attachments/assets/8f5c0b07-cde4-4459-bf93-d2962c639dcd)
*Order management with golden theme*

## ใบอนุญาต
MIT License