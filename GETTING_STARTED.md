# 🚀 Getting Started with POOH Food Track

Welcome! This guide will help you set up the POOH Food tracking system with SMS authentication using your Cudy LT500 router.

## 📋 What You're Setting Up

- **Frontend**: Thai food ordering web application
- **Backend**: SMS verification server
- **Router**: Cudy LT500 4G LTE router for sending SMS
- **VPN (Optional)**: ZeroTier for remote router access

## 🎯 Choose Your Setup Path

### Option 1: Quick Start with ZeroTier VPN (Recommended for Remote Setup)
**Best for:** Production deployment, remote access, cloud hosting

👉 **Follow:** [QUICKSTART_ZEROTIER.md](QUICKSTART_ZEROTIER.md)

⏱️ **Time:** ~15 minutes  
🎓 **Difficulty:** Easy  
✅ **Benefits:** 
- Access router from anywhere
- Secure encrypted connection
- Works with Render, VPS, or any cloud hosting
- No port forwarding needed

### Option 2: Local Network Setup
**Best for:** Development, testing, same-location setup

👉 **Follow:** [SMS_SETUP.md](SMS_SETUP.md)

⏱️ **Time:** ~10 minutes  
🎓 **Difficulty:** Easy  
✅ **Benefits:**
- Fastest setup
- No VPN needed
- Direct connection to router

### Option 3: Port Forwarding Setup
**Best for:** Static public IP scenarios

👉 **Follow:** [SMS_SETUP.md](SMS_SETUP.md) + Router port forwarding

⏱️ **Time:** ~20 minutes  
🎓 **Difficulty:** Medium  
⚠️ **Note:** Less secure than VPN, requires router configuration

## 📚 Documentation Index

### Essential Guides

| Document | Purpose | When to Use |
|----------|---------|-------------|
| [QUICKSTART_ZEROTIER.md](QUICKSTART_ZEROTIER.md) | Quick setup with VPN | Starting with ZeroTier VPN |
| [SMS_SETUP.md](SMS_SETUP.md) | Complete SMS setup | Detailed SMS configuration |
| [ZEROTIER_VPN_SETUP.md](ZEROTIER_VPN_SETUP.md) | Full VPN guide | In-depth ZeroTier setup |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Production deployment | Deploying to Render/Vercel |
| [backend/README.md](backend/README.md) | Backend API docs | Understanding the backend |

### Quick Reference

| Task | Command/Link |
|------|--------------|
| Install backend dependencies | `cd backend && npm install` |
| Start backend server | `npm start` |
| Test backend status | `curl http://localhost:3000/api/status` |
| Check ZeroTier connection | `sudo zerotier-cli listnetworks` |
| Join ZeroTier network | `sudo zerotier-cli join <NETWORK_ID>` |
| Test SMS sending | See [Testing](#testing-your-setup) below |

## 🔧 Prerequisites

Before starting, ensure you have:

### Hardware
- ✅ **Cudy LT500 4G LTE Router** (with OpenWRT/LuCI firmware)
- ✅ **Active SIM Card** (with SMS capability and credit)
- ✅ **Server/Computer** (for backend - can be VPS, Render, or local)

### Software
- ✅ **Node.js** >= 14.0.0 ([Download](https://nodejs.org/))
- ✅ **Git** ([Download](https://git-scm.com/))
- ✅ **ZeroTier account** (if using VPN) - [Sign up free](https://my.zerotier.com)

### Network
- ✅ Router has good 4G signal
- ✅ Router is accessible (local network or will setup VPN)
- ✅ Know router admin credentials

## 🚀 Quick Setup (Local Network)

**If your backend and router are on the same network:**

```bash
# 1. Clone repository
git clone https://github.com/ALEX-SHR-SUDO/pooh_food_track.git
cd pooh_food_track

# 2. Configure backend
cd backend
cp .env.example .env
nano .env  # Edit ROUTER_IP, ROUTER_USER, ROUTER_PASS

# 3. Install and start
npm install
npm start

# 4. Test (in another terminal)
curl http://localhost:3000/api/status
```

**Expected output:**
```json
{
  "success": true,
  "status": "online",
  "routerConnected": true,
  "routerIp": "192.168.10.1",
  "activeCodes": 0
}
```

## 🌐 Quick Setup (ZeroTier VPN)

**If your backend is remote from your router:**

```bash
# 1. Create ZeroTier network at https://my.zerotier.com
#    Note your Network ID (e.g., a1b2c3d4e5f6g7h8)

# 2. Install ZeroTier on router
ssh root@192.168.10.1
opkg update && opkg install zerotier
zerotier-cli join YOUR_NETWORK_ID

# 3. Install ZeroTier on backend server
curl -s https://install.zerotier.com | sudo bash
sudo zerotier-cli join YOUR_NETWORK_ID

# 4. Authorize both devices at https://my.zerotier.com
#    Note the ZeroTier IPs assigned

# 5. Configure backend
cd pooh_food_track/backend
cp .env.example .env
nano .env  # Set ROUTER_IP to router's ZeroTier IP

# 6. Start backend
npm install
npm start
```

👉 **Full guide:** [QUICKSTART_ZEROTIER.md](QUICKSTART_ZEROTIER.md)

## 🧪 Testing Your Setup

### Test 1: Backend Status
```bash
curl http://localhost:3000/api/status
```

**Should return:**
```json
{
  "success": true,
  "status": "online",
  "routerConnected": true,
  "routerIp": "10.147.20.2",
  "activeCodes": 0
}
```

### Test 2: Send Verification Code
```bash
curl -X POST http://localhost:3000/api/send-verification-code \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"+1234567890"}'
```

**Should return:**
```json
{
  "success": true,
  "message": "Verification code sent successfully",
  "expiresIn": 300
}
```

**Check your phone** - you should receive SMS with a 4-digit code! 📱

### Test 3: Verify Code
```bash
curl -X POST http://localhost:3000/api/verify-code \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"+1234567890","code":"1234"}'
```

Replace `1234` with the code you received.

## 🎨 Frontend Setup

After backend is working:

```bash
# 1. Open index.html in browser
# 2. Click "เข้าสู่ระบบด้วยเบอร์โทร" (Login with Phone)
# 3. Enter your phone number
# 4. Receive and enter verification code
# 5. Start ordering food! 🍜
```

For production deployment to Vercel:
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for full deployment instructions.

## ❓ Common Issues

### Issue: "Cannot connect to router"

**Symptoms:**
```
✗ Router connection check failed: connect ETIMEDOUT
```

**Solutions:**
1. Check router is powered on
2. Verify ROUTER_IP in .env is correct
3. Test: `ping <ROUTER_IP>`
4. For ZeroTier: Check both devices authorized
5. For ZeroTier: `sudo zerotier-cli listnetworks` should show "OK"

### Issue: "SMS not sending"

**Symptoms:**
```
✗ Failed to send SMS: 500
```

**Solutions:**
1. Check SIM card is inserted correctly
2. Verify SIM has credit
3. Check 4G signal strength on router
4. Test SMS manually via router web interface
5. Check router username/password in .env

### Issue: "Authentication failed"

**Symptoms:**
```
✗ Authentication failed - no sysauth cookie received
```

**Solutions:**
1. Verify router credentials in .env
2. Try accessing router web interface manually
3. Check router is running OpenWRT/LuCI
4. Try default credentials: admin/admin

### Issue: "ZeroTier not connecting"

**Symptoms:**
```
ping: connect: Network is unreachable
```

**Solutions:**
1. Check ZeroTier service: `sudo systemctl status zerotier-one`
2. Verify devices authorized in ZeroTier dashboard
3. Restart ZeroTier: `sudo systemctl restart zerotier-one`
4. Check firewall allows UDP port 9993

**More troubleshooting:** See [ZEROTIER_VPN_SETUP.md](ZEROTIER_VPN_SETUP.md#troubleshooting)

## 📖 Architecture Overview

```
┌─────────────────┐
│  Frontend       │
│  (Vercel)       │
│  index.html     │
│  script.js      │
└────────┬────────┘
         │ HTTPS
         │
┌────────▼────────┐      ┌──────────────┐
│  Backend        │◄─────┤  ZeroTier    │
│  (Render/VPS)   │ VPN  │  Network     │
│  SMS Server     │      └──────┬───────┘
└────────┬────────┘             │
         │ HTTP API              │
         │ over ZeroTier         │
         │                       │
┌────────▼────────┐      ┌──────▼───────┐
│  Cudy LT500     │      │  Router on   │
│  Router         │◄─────┤  ZeroTier    │
│  SMS Gateway    │      └──────────────┘
└────────┬────────┘
         │ 4G/SMS
         │
┌────────▼────────┐
│  User's Phone   │
│  Receives SMS   │
└─────────────────┘
```

## 🎓 Learning Path

### Beginner
1. ✅ Start with [QUICKSTART_ZEROTIER.md](QUICKSTART_ZEROTIER.md)
2. ✅ Test locally first
3. ✅ Deploy to Render using [DEPLOYMENT.md](DEPLOYMENT.md)

### Intermediate
1. ✅ Review [ZEROTIER_VPN_SETUP.md](ZEROTIER_VPN_SETUP.md)
2. ✅ Understand security best practices
3. ✅ Set up monitoring and logging

### Advanced
1. ✅ Implement Redis for code storage
2. ✅ Add load balancing
3. ✅ Set up multi-region deployment
4. ✅ Integrate with external monitoring tools

## 📞 Getting Help

### Resources
- 📖 **Documentation**: All guides in this repository
- 🐛 **Issues**: [GitHub Issues](https://github.com/ALEX-SHR-SUDO/pooh_food_track/issues)
- 📧 **Support**: Open an issue on GitHub

### Before Asking for Help
1. ✅ Check backend logs: `npm start` or `pm2 logs`
2. ✅ Test router manually via web interface
3. ✅ Verify ZeroTier connection: `zerotier-cli listnetworks`
4. ✅ Review troubleshooting section in relevant guide

## 🔒 Security Checklist

Before going to production:
- [ ] Changed default router password
- [ ] Set ZeroTier network to "Private" mode
- [ ] Never committed .env file to git
- [ ] Using strong passwords (16+ characters)
- [ ] Enabled firewall on backend server
- [ ] Limited network members in ZeroTier
- [ ] Set up HTTPS for frontend
- [ ] Implemented rate limiting on backend API
- [ ] Regular security updates scheduled

## 📝 Next Steps

After successful setup:

1. **Customize Frontend**
   - Update menu items in `index.html`
   - Modify styles in `styles.css`
   - Adjust prices and descriptions

2. **Configure SMS Messages**
   - Edit message template in `backend/cudy-sms-server.js`
   - Customize for your business

3. **Deploy to Production**
   - Follow [DEPLOYMENT.md](DEPLOYMENT.md)
   - Set up monitoring
   - Configure backups

4. **Add Features**
   - Order history
   - Admin dashboard
   - Payment integration
   - Delivery tracking

## 🎉 Success!

If you've completed the setup and SMS is working, congratulations! 🎊

You now have a fully functional Thai food ordering system with SMS authentication!

**Enjoy your POOH Food Track system!** 🍜🎉

---

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details

---

**Made with ❤️ for POOH Food**
