# SMS Authentication Setup Guide

Complete guide for setting up SMS authentication using Cudy LT500 4G LTE router.

## Table of Contents
- [Hardware Requirements](#hardware-requirements)
- [Router Setup](#router-setup)
- [Backend Installation](#backend-installation)
- [Frontend Configuration](#frontend-configuration)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Production Deployment](#production-deployment)

## Hardware Requirements

### Required Equipment
- **Cudy LT500 4G LTE Router** (or compatible OpenWRT router)
- **SIM Card** with SMS capabilities and active credit
- **Internet Connection** for router configuration
- **Server/VPS** (for production deployment)

### Network Configuration
- Router should be accessible on local network or via VPN
- Default router IP: `192.168.10.1` (local network)
- ZeroTier VPN IP: varies (e.g., `10.147.20.2`) - see [ZEROTIER_VPN_SETUP.md](ZEROTIER_VPN_SETUP.md)
- Ensure good mobile signal strength for reliable SMS delivery
- For remote deployment, ZeroTier VPN is recommended

## Router Setup

### 1. Initial Router Configuration

1. **Connect to Router**
   - Connect to router via WiFi or Ethernet
   - Access web interface: `http://192.168.10.1` (or `http://cudy.net`)

2. **Login to Router**
   - Default username: `admin`
   - Default password: `admin`
   - Change default password for security

3. **Insert SIM Card**
   - Power off the router
   - Insert activated SIM card
   - Power on and wait for network connection (~30 seconds)

### 2. Verify SMS Functionality

1. Navigate to **Network → GCOM SMS** in router interface
2. Test sending SMS manually:
   - Interface: Select `4g`
   - Phone number: Enter test number (e.g., `+972501234567`)
   - Message: Enter test message
   - Click "Send SMS"
3. Verify SMS is received on test phone

### 3. Check Router API Settings

1. Verify OpenWRT/LuCI is running
2. Enable SMS API if required
3. Note down:
   - Router IP address
   - Admin username
   - Admin password

## Backend Installation

### 1. Prerequisites

```bash
# Check Node.js version (requires >= 14.0.0)
node --version

# Check npm version
npm --version
```

If Node.js is not installed:
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# macOS with Homebrew
brew install node
```

### 2. Install Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

### 3. Configure Environment

Edit `.env` file:

```env
# Router Configuration
ROUTER_IP=192.168.10.1        # Your router's IP address
                               # For local network: 192.168.10.1
                               # For ZeroTier VPN: use ZeroTier IP (e.g., 10.147.20.2)
ROUTER_USER=admin              # Router admin username
ROUTER_PASS=your_password      # Router admin password (change this!)

# Server Configuration
PORT=3000                      # Backend server port

# Optional Settings
DEBUG=false                    # Enable debug logging
ROUTER_TIMEOUT=10000           # Connection timeout (ms) - increase for VPN
```

**For ZeroTier VPN Setup:**
See [ZEROTIER_VPN_SETUP.md](ZEROTIER_VPN_SETUP.md) for complete instructions on connecting to your router remotely via ZeroTier VPN.

**Security Notes:**
- Never commit `.env` file to git
- Use strong router password
- Restrict backend access in production

### 4. Start Backend Server

**Development Mode:**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

You should see:
```
╔═══════════════════════════════════════════════╗
║     🍽️  POOH Food SMS Server                  ║
║     🚀 Server running on port 3000            ║
║     📱 Cudy LT500 SMS Gateway Active          ║
╚═══════════════════════════════════════════════╝
✓ Router connection successful
```

### 5. Test Backend API

```bash
# Check server status
curl http://localhost:3000/api/status

# Send test verification code
curl -X POST http://localhost:3000/api/send-verification-code \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"+972501234567"}'
```

## Frontend Configuration

### 1. Update API URL

If backend is running on different host/port, update `script.js`:

```javascript
class PhoneAuthSystem {
    constructor() {
        // Change this if backend is on different host
        this.SMS_API_URL = 'http://localhost:3000';
        // ...
    }
}
```

For production:
```javascript
this.SMS_API_URL = 'https://your-domain.com/api';
```

### 2. CORS Configuration

If frontend and backend are on different domains, ensure CORS is enabled in backend.

The backend already has CORS enabled by default:
```javascript
app.use(cors());
```

For production, restrict CORS to your domain:
```javascript
app.use(cors({
    origin: 'https://your-domain.com',
    credentials: true
}));
```

## Testing

### 1. Test Authentication Flow

1. **Open Frontend**
   - Navigate to `http://localhost:8080` (or your frontend URL)

2. **Test Login**
   - Click "เข้าสู่ระบบด้วยเบอร์โทร" (Login with Phone)
   - Enter phone number: `+972501234567`
   - Click "ส่งรหัสยืนยัน" (Send Code)

3. **Verify Code**
   - Check phone for SMS with 4-digit code
   - Enter code in modal
   - Click "ยืนยันรหัส" (Verify Code)

4. **Test Order**
   - Add items to cart
   - Click "ยืนยันคำสั่งซื้อ" (Confirm Order)
   - Order should be confirmed

### 2. Test Security Features

**Code Expiry:**
```bash
# Send code
curl -X POST http://localhost:3000/api/send-verification-code \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"+972501234567"}'

# Wait 6 minutes
sleep 360

# Try to verify (should fail with expired error)
curl -X POST http://localhost:3000/api/verify-code \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"+972501234567","code":"1234"}'
```

**Rate Limiting:**
```bash
# Send first code
curl -X POST http://localhost:3000/api/send-verification-code \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"+972501234567"}'

# Try to send again immediately (should fail with rate limit)
curl -X POST http://localhost:3000/api/send-verification-code \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"+972501234567"}'
```

**Max Attempts:**
- Send verification code
- Try 3 wrong codes
- 4th attempt should fail

## Troubleshooting

### Router Connection Issues

**Problem:** Cannot connect to router
```
✗ Router connection check failed: connect ETIMEDOUT
```

**Solutions:**
1. Verify router IP: `ping 192.168.10.1` (or your ZeroTier IP)
2. Check router is powered on
3. Verify network connectivity
4. Try accessing router web interface manually
5. Check firewall settings
6. **For ZeroTier VPN**: Verify ZeroTier connection with `sudo zerotier-cli listnetworks`
7. **For ZeroTier VPN**: Ensure both devices are authorized in the ZeroTier dashboard

### Authentication Fails

**Problem:** Authentication failed - no sysauth cookie
```
✗ Authentication failed - no sysauth cookie received
```

**Solutions:**
1. Verify router username/password in `.env`
2. Check router runs OpenWRT/LuCI
3. Try logging in manually through web interface
4. Check router firmware version
5. Restart router

### SMS Not Sending

**Problem:** SMS fails to send
```
✗ Failed to send SMS: 500
```

**Solutions:**
1. Check SIM card is inserted correctly
2. Verify SIM has active credit
3. Check mobile signal strength (need good signal)
4. Test SMS manually through router interface
5. Check SMS center number in router settings
6. Verify phone number format (+country code)

### CORS Errors

**Problem:** CORS error in browser console
```
Access to fetch at 'http://localhost:3000' blocked by CORS policy
```

**Solutions:**
1. Verify backend is running
2. Check CORS middleware is enabled
3. Update CORS origin in production
4. Use proxy in development

## Production Deployment

### Remote Access Options

**Option 1: ZeroTier VPN (Recommended)**
- Secure encrypted connection to router from anywhere
- Works behind NAT and firewalls
- Easy setup and configuration
- See [ZEROTIER_VPN_SETUP.md](ZEROTIER_VPN_SETUP.md) for complete guide

**Option 2: Port Forwarding**
- Requires static public IP
- Must configure router firewall carefully
- Less secure than VPN
- Not recommended for production

**Option 3: Local Network Only**
- Backend must be on same LAN as router
- Most secure but limited to local access
- Good for development/testing

### 1. VPS Setup

**Recommended Specs:**
- OS: Ubuntu 20.04 LTS or later
- RAM: 1GB minimum
- Storage: 10GB minimum
- CPU: 1 core minimum

### 2. Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 (process manager)
sudo npm install -g pm2

# Install Nginx (reverse proxy)
sudo apt install -y nginx

# Install certbot (for SSL)
sudo apt install -y certbot python3-certbot-nginx
```

### 3. Deploy Backend

```bash
# Clone repository
git clone https://github.com/ALEX-SHR-SUDO/pooh_food_track.git
cd pooh_food_track/backend

# Install dependencies
npm install --production

# Configure environment
cp .env.example .env
nano .env  # Edit with production settings

# Start with PM2
pm2 start cudy-sms-server.js --name "pooh-sms"

# Setup PM2 startup
pm2 startup
pm2 save
```

### 4. Configure Nginx

Create Nginx configuration:
```bash
sudo nano /etc/nginx/sites-available/pooh-sms
```

Add configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location /api/ {
        proxy_pass http://localhost:3000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/pooh-sms /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 5. Setup SSL Certificate

```bash
# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Verify auto-renewal
sudo certbot renew --dry-run
```

### 6. Update Frontend

Update `script.js` with production API URL:
```javascript
this.SMS_API_URL = 'https://your-domain.com/api';
```

### 7. Monitoring

**Check backend status:**
```bash
pm2 status
pm2 logs pooh-sms
```

**Monitor SMS activity:**
```bash
pm2 logs pooh-sms --lines 100
```

**Check system resources:**
```bash
pm2 monit
```

### 8. Security Hardening

1. **Firewall:**
```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

2. **Fail2ban:**
```bash
sudo apt install -y fail2ban
sudo systemctl enable fail2ban
```

3. **Update .env permissions:**
```bash
chmod 600 backend/.env
```

4. **Regular updates:**
```bash
sudo apt update && sudo apt upgrade -y
npm update
```

## Advanced Configuration

### Using Redis for Code Storage

For production, consider using Redis instead of in-memory storage:

1. **Install Redis:**
```bash
sudo apt install redis-server
sudo systemctl enable redis-server
```

2. **Update backend code:**
```javascript
const redis = require('redis');
const client = redis.createClient();

// Store code
await client.setEx(`verify:${phoneNumber}`, 300, JSON.stringify({
    code: code,
    attempts: 0
}));

// Retrieve code
const data = await client.get(`verify:${phoneNumber}`);
```

### Load Balancing

For high traffic, use multiple backend instances with load balancer.

### Monitoring & Logging

Consider integrating:
- **Logging:** Winston, Bunyan
- **Monitoring:** PM2 Plus, DataDog, New Relic
- **Error Tracking:** Sentry

## Support

For issues or questions:
- Check [backend/README.md](backend/README.md)
- Review server logs: `pm2 logs pooh-sms`
- Test router manually through web interface
- Verify network connectivity

## License

MIT
