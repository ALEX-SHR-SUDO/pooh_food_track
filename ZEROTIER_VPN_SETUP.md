# ZeroTier VPN Setup Guide for Cudy LT500 Router

Complete guide for setting up ZeroTier VPN to access your Cudy LT500 router remotely for SMS functionality.

## Table of Contents
- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [ZeroTier Network Setup](#zerotier-network-setup)
- [Router Configuration](#router-configuration)
- [Backend Server Configuration](#backend-server-configuration)
- [Testing Connection](#testing-connection)
- [Troubleshooting](#troubleshooting)
- [Security Best Practices](#security-best-practices)

## Overview

This guide helps you configure ZeroTier VPN to create a secure virtual network between your backend server and Cudy LT500 router, allowing remote SMS functionality regardless of physical location.

**Benefits of ZeroTier:**
- 🌐 Access router from anywhere in the world
- 🔒 Encrypted peer-to-peer connection
- 🚀 Easy setup and configuration
- 📱 Works behind NAT and firewalls
- ⚡ Low latency connections

## Prerequisites

### Required Items
- **Cudy LT500 4G LTE Router** with OpenWRT firmware
- **ZeroTier Account** (free at https://my.zerotier.com)
- **Backend Server** (VPS, local machine, or Render.com)
- **SIM Card** with SMS capabilities in the router

### Before You Begin
1. Ensure router has internet connectivity (4G LTE)
2. Know your router's admin credentials
3. Have SSH or console access to your backend server
4. Create a ZeroTier account if you don't have one

## ZeroTier Network Setup

### 1. Create ZeroTier Network

1. **Login to ZeroTier**
   - Go to https://my.zerotier.com
   - Login or create a free account

2. **Create Network**
   - Click "Create A Network"
   - Note down your **Network ID** (e.g., `a1b2c3d4e5f6g7h8`)
   - Give your network a name (e.g., "POOH Food Network")

3. **Configure Network Settings**
   - Access Control: Choose "Private" for security
   - IPv4 Auto-Assign: Enable
   - Note the IPv4 range (e.g., `10.147.20.0/24`)

### 2. Install ZeroTier on Backend Server

**Ubuntu/Debian:**
```bash
# Install ZeroTier
curl -s https://install.zerotier.com | sudo bash

# Join your network
sudo zerotier-cli join <YOUR_NETWORK_ID>

# Check status
sudo zerotier-cli listnetworks
```

**macOS:**
```bash
# Install via Homebrew
brew install zerotier-one

# Start service
brew services start zerotier-one

# Join network
sudo zerotier-cli join <YOUR_NETWORK_ID>
```

**Windows:**
- Download installer from https://www.zerotier.com/download/
- Install and run ZeroTier One
- Click system tray icon → "Join Network"
- Enter your Network ID

### 3. Authorize Backend Server

1. Go to ZeroTier network page: https://my.zerotier.com
2. Scroll to "Members" section
3. Find your server (shows hostname or device name)
4. Check the "Auth" checkbox to authorize
5. Note the assigned **ZeroTier IP** (e.g., `10.147.20.1`)

## Router Configuration

### Option 1: Install ZeroTier on Router (Recommended)

**If your Cudy LT500 runs OpenWRT:**

1. **SSH into Router**
   ```bash
   ssh root@192.168.10.1
   # Enter router password
   ```

2. **Install ZeroTier Package**
   ```bash
   # Update package list
   opkg update
   
   # Install ZeroTier
   opkg install zerotier
   
   # Enable and start service
   /etc/init.d/zerotier enable
   /etc/init.d/zerotier start
   ```

3. **Join ZeroTier Network**
   ```bash
   # Join network
   zerotier-cli join <YOUR_NETWORK_ID>
   
   # Check status
   zerotier-cli listnetworks
   ```

4. **Authorize Router in ZeroTier**
   - Go to https://my.zerotier.com
   - Find router in Members section
   - Check "Auth" checkbox
   - Note the ZeroTier IP assigned (e.g., `10.147.20.2`)

5. **Configure Firewall**
   ```bash
   # Allow ZeroTier traffic
   uci add firewall rule
   uci set firewall.@rule[-1].name='Allow-ZeroTier'
   uci set firewall.@rule[-1].src='*'
   uci set firewall.@rule[-1].dest='*'
   uci set firewall.@rule[-1].proto='udp'
   uci set firewall.@rule[-1].dest_port='9993'
   uci set firewall.@rule[-1].target='ACCEPT'
   uci commit firewall
   /etc/init.d/firewall restart
   ```

### Option 2: Port Forwarding Through VPN Gateway

**If router doesn't support ZeroTier directly:**

1. **Setup VPN Gateway Device**
   - Use a Raspberry Pi, old PC, or VM on the same network as router
   - Install ZeroTier on this device
   - Join your ZeroTier network
   - Configure port forwarding

2. **Configure IP Forwarding**
   ```bash
   # On gateway device
   sudo sysctl -w net.ipv4.ip_forward=1
   echo "net.ipv4.ip_forward=1" | sudo tee -a /etc/sysctl.conf
   ```

3. **Setup NAT/Port Forward**
   ```bash
   # Forward router traffic through gateway
   sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j DNAT --to-destination 192.168.10.1:80
   sudo iptables -t nat -A POSTROUTING -j MASQUERADE
   
   # Save iptables rules
   sudo apt install iptables-persistent
   sudo netfilter-persistent save
   ```

4. **Add Route in ZeroTier**
   - Go to https://my.zerotier.com → Your Network
   - Under "Routes", add:
     - Destination: `192.168.10.0/24`
     - Via: `<GATEWAY_ZEROTIER_IP>`

## Backend Server Configuration

### 1. Update Environment Configuration

Edit your `.env` file:

```env
# ===== ZeroTier VPN Configuration =====

# Router IP Address (Use ZeroTier IP when connected via VPN)
# Local network: 192.168.10.1
# ZeroTier VPN: Use the IP assigned by ZeroTier (e.g., 10.147.20.2)
ROUTER_IP=10.147.20.2

# Router Credentials
ROUTER_USER=admin
ROUTER_PASS=your_secure_password

# Server Configuration
PORT=3000

# Optional: Connection timeout (milliseconds)
ROUTER_TIMEOUT=10000

# Optional: Enable debug logging
DEBUG=false

# ===== ZeroTier Information (for documentation) =====
# Network ID: a1b2c3d4e5f6g7h8
# Router ZeroTier IP: 10.147.20.2
# Backend ZeroTier IP: 10.147.20.1
```

### 2. Verify ZeroTier Connection

**Check ZeroTier Status:**
```bash
# View network status
sudo zerotier-cli listnetworks

# Should show:
# 200 listnetworks <network_id> <name> <device> <ZT_IP> OK PRIVATE

# Test ping to router
ping 10.147.20.2

# Test router web interface
curl http://10.147.20.2/cgi-bin/luci
```

### 3. Test Router API Access

```bash
# Test from backend server
cd /path/to/pooh_food_track/backend

# Start server
npm start

# In another terminal, test status endpoint
curl http://localhost:3000/api/status

# Should show:
# {
#   "success": true,
#   "status": "online",
#   "routerConnected": true,
#   "routerIp": "10.147.20.2",
#   "activeCodes": 0
# }
```

## Testing Connection

### 1. Test ZeroTier Connectivity

**From Backend Server:**
```bash
# Check ZeroTier service
sudo zerotier-cli info

# List peers (should show router if both connected)
sudo zerotier-cli listpeers

# Ping router via ZeroTier
ping -c 4 10.147.20.2

# Test router web interface
curl -I http://10.147.20.2/cgi-bin/luci
```

### 2. Test SMS Functionality

**Send Test Verification Code:**
```bash
# Send code
curl -X POST http://localhost:3000/api/send-verification-code \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"+1234567890"}'

# Expected response:
# {
#   "success": true,
#   "message": "Verification code sent successfully",
#   "expiresIn": 300
# }
```

**Check Phone for SMS:**
- You should receive SMS with 4-digit code
- If not, check troubleshooting section

### 3. Monitor Logs

```bash
# On backend server (if using PM2)
pm2 logs pooh-sms

# Or with npm
npm start

# Watch for:
# ✓ Router connection successful
# ✓ Successfully authenticated with Cudy LT500 router
# ✓ SMS sent successfully to +1234567890
```

## Troubleshooting

### Cannot Join ZeroTier Network

**Problem:** `zerotier-cli join` fails or shows error

**Solutions:**
1. Check ZeroTier service is running:
   ```bash
   sudo systemctl status zerotier-one
   ```
2. Restart ZeroTier service:
   ```bash
   sudo systemctl restart zerotier-one
   ```
3. Verify network ID is correct
4. Check firewall allows UDP port 9993:
   ```bash
   sudo ufw allow 9993/udp
   ```

### Router Not Visible in ZeroTier

**Problem:** Router doesn't appear in network members

**Solutions:**
1. Verify ZeroTier installed on router:
   ```bash
   ssh root@192.168.10.1
   zerotier-cli info
   ```
2. Check router joined network:
   ```bash
   zerotier-cli listnetworks
   ```
3. Restart ZeroTier on router:
   ```bash
   /etc/init.d/zerotier restart
   ```
4. Check router has internet connection

### Cannot Ping Router via ZeroTier

**Problem:** `ping 10.147.20.2` fails with "Destination Host Unreachable"

**Solutions:**
1. Verify both devices authorized in ZeroTier dashboard
2. Check router's ZeroTier interface is up:
   ```bash
   # On router
   ip addr show zt+
   ```
3. Disable router firewall temporarily to test:
   ```bash
   # On router
   /etc/init.d/firewall stop
   # Test connection, then restart:
   /etc/init.d/firewall start
   ```
4. Check ZeroTier routes are configured

### Backend Cannot Connect to Router

**Problem:** API status shows `routerConnected: false`

**Solutions:**
1. Verify ROUTER_IP in `.env` matches ZeroTier IP
2. Test HTTP connection manually:
   ```bash
   curl -v http://10.147.20.2/cgi-bin/luci
   ```
3. Check router credentials are correct
4. Increase timeout in cudy-lt500-api.js:
   ```javascript
   timeout: 10000 // 10 seconds
   ```
5. Check router web interface is accessible

### SMS Not Sending via VPN

**Problem:** SMS fails to send through ZeroTier connection

**Solutions:**
1. Test SMS manually through router web interface
2. Verify SIM card has credit and signal
3. Check latency is acceptable:
   ```bash
   ping -c 10 10.147.20.2
   # Look for: rtt min/avg/max - should be < 500ms for reliable SMS
   ```
4. Review backend logs for authentication errors
5. Try direct connection to verify router SMS works

### High Latency or Timeouts

**Problem:** Connection is slow or times out

**Solutions:**
1. Check ZeroTier peers are directly connected:
   ```bash
   sudo zerotier-cli listpeers | grep DIRECT
   ```
2. If showing RELAY, check:
   - Both devices allow UDP port 9993
   - Firewall/NAT settings
   - Network allows P2P connections
3. Increase timeout values in backend
4. Consider using managed ZeroTier roots for better performance

### Router Loses Connection

**Problem:** Router periodically disconnects from ZeroTier

**Solutions:**
1. Ensure ZeroTier starts on boot:
   ```bash
   # On router
   /etc/init.d/zerotier enable
   ```
2. Check router power and 4G signal
3. Add keepalive script:
   ```bash
   # Create /etc/zerotier-keepalive.sh
   #!/bin/sh
   while true; do
     if ! zerotier-cli info > /dev/null 2>&1; then
       /etc/init.d/zerotier restart
     fi
     sleep 300
   done
   ```
4. Monitor router logs for issues

## Security Best Practices

### 1. ZeroTier Network Security

- ✅ Use **Private** network (requires authorization)
- ✅ Enable **Certificate Authentication** if available
- ✅ Limit network members to only required devices
- ✅ Regularly audit member list and remove unused devices
- ✅ Use descriptive names for members

### 2. Router Security

- ✅ Change default admin password
- ✅ Use strong password (16+ characters, mixed case, numbers, symbols)
- ✅ Disable WAN access to router admin interface
- ✅ Keep router firmware updated
- ✅ Enable router firewall
- ✅ Only allow necessary ports through firewall

### 3. Backend Security

- ✅ Never commit `.env` file to git
- ✅ Use environment variables for sensitive data
- ✅ Restrict backend API access (add authentication if public)
- ✅ Use HTTPS in production (SSL/TLS)
- ✅ Implement rate limiting on API endpoints
- ✅ Monitor logs for suspicious activity
- ✅ Keep dependencies updated

### 4. ZeroTier Best Practices

- ✅ Use separate network for production vs development
- ✅ Document member IPs and purposes
- ✅ Set up IP ranges to avoid conflicts
- ✅ Use flow rules to restrict traffic if needed
- ✅ Enable multicast if needed for service discovery
- ✅ Regular network audit and cleanup

## Production Deployment with ZeroTier

### 1. Deploy Backend to Render/VPS

**On your VPS/Server:**
```bash
# Install ZeroTier
curl -s https://install.zerotier.com | sudo bash

# Join network
sudo zerotier-cli join <YOUR_NETWORK_ID>

# Authorize in ZeroTier dashboard

# Clone repository
git clone https://github.com/ALEX-SHR-SUDO/pooh_food_track.git
cd pooh_food_track/backend

# Install dependencies
npm install --production

# Configure .env with ZeroTier IPs
nano .env

# Start with PM2
npm install -g pm2
pm2 start cudy-sms-server.js --name pooh-sms
pm2 startup
pm2 save
```

### 2. Configure Firewall

```bash
# Allow backend port
sudo ufw allow 3000/tcp

# Allow ZeroTier
sudo ufw allow 9993/udp

# Enable firewall
sudo ufw enable
```

### 3. Setup Monitoring

```bash
# Monitor PM2 process
pm2 monit

# Check logs
pm2 logs pooh-sms --lines 100

# Set up log rotation
pm2 install pm2-logrotate
```

### 4. Create Systemd Service (Alternative to PM2)

```bash
# Create service file
sudo nano /etc/systemd/system/pooh-sms.service
```

Add:
```ini
[Unit]
Description=POOH Food SMS Service
After=network.target zerotier-one.service

[Service]
Type=simple
User=your-user
WorkingDirectory=/path/to/pooh_food_track/backend
ExecStart=/usr/bin/node cudy-sms-server.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

Enable:
```bash
sudo systemctl enable pooh-sms
sudo systemctl start pooh-sms
sudo systemctl status pooh-sms
```

## Advanced Configuration

### Multi-Region Setup

For multiple backend servers across regions:

1. **Create ZeroTier Network Per Region** (optional)
2. **Load Balancer** pointing to multiple backends
3. **Shared Redis** for verification codes
4. **Router Failover** if using multiple routers

### High Availability

```bash
# Use Redis for shared state
npm install redis

# Update cudy-sms-server.js to use Redis
# instead of in-memory Map for verificationCodes
```

### Custom ZeroTier Routes

Add routes for local networks:
```bash
# In ZeroTier dashboard → Routes
# Destination: 192.168.10.0/24
# Via: <gateway_zerotier_ip>
```

## Monitoring & Maintenance

### Regular Checks

**Weekly:**
- Check ZeroTier connection status
- Review backend logs for errors
- Test SMS sending
- Verify router connectivity

**Monthly:**
- Update backend dependencies
- Update ZeroTier client
- Review ZeroTier member list
- Check SIM card credit/expiry
- Audit security logs

### Health Check Script

Create `/usr/local/bin/pooh-health-check.sh`:
```bash
#!/bin/bash

# Check ZeroTier
if ! zerotier-cli info > /dev/null 2>&1; then
    echo "❌ ZeroTier not running"
    exit 1
fi

# Check router ping
if ! ping -c 1 -W 2 10.147.20.2 > /dev/null 2>&1; then
    echo "❌ Cannot reach router"
    exit 1
fi

# Check backend API
if ! curl -s http://localhost:3000/api/status | grep -q '"success":true'; then
    echo "❌ Backend API not responding"
    exit 1
fi

echo "✅ All systems operational"
exit 0
```

Run via cron every 5 minutes:
```bash
*/5 * * * * /usr/local/bin/pooh-health-check.sh >> /var/log/pooh-health.log 2>&1
```

## Support & Resources

### Documentation
- [ZeroTier Manual](https://docs.zerotier.com/)
- [OpenWRT ZeroTier Package](https://openwrt.org/docs/guide-user/services/vpn/zerotier)
- [Cudy Router Documentation](https://www.cudytech.com/support)

### Getting Help
- Check backend logs: `pm2 logs pooh-sms` or `npm start`
- Review ZeroTier status: `sudo zerotier-cli info`
- Test router manually through web interface
- Check this repository's Issues section

### Common Issues
See main [SMS_SETUP.md](SMS_SETUP.md) for additional troubleshooting.

## License

MIT
