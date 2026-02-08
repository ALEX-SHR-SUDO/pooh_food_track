# Quick Start Guide - ZeroTier VPN Setup

This is a simplified guide to get your POOH Food service working with ZeroTier VPN.

## What You Need

1. ✅ Cudy LT500 router with SIM card and SMS capability
2. ✅ Backend server (Render, VPS, or local computer)
3. ✅ ZeroTier account (free at https://my.zerotier.com)

## Step-by-Step Setup (15 minutes)

### Step 1: Create ZeroTier Network (5 min)

1. Go to https://my.zerotier.com and login/signup
2. Click **"Create A Network"**
3. **Write down your Network ID** (16 characters, e.g., `a1b2c3d4e5f6g7h8`)
4. Click on the network name to configure it
5. Set **Access Control** to **"Private"**
6. Note the **IPv4 range** (e.g., `10.147.20.0/24`)

### Step 2: Install ZeroTier on Router (5 min)

**SSH into your Cudy LT500:**
```bash
ssh root@192.168.10.1
# Enter your router password
```

**Install ZeroTier:**
```bash
# Update packages
opkg update

# Install ZeroTier
opkg install zerotier

# Start service
/etc/init.d/zerotier enable
/etc/init.d/zerotier start

# Join your network (replace with YOUR network ID)
zerotier-cli join YOUR_NETWORK_ID

# Check status
zerotier-cli listnetworks
```

**Authorize Router:**
1. Go back to https://my.zerotier.com
2. Select your network
3. Scroll to **"Members"** section
4. Find your router (may show as hostname or MAC address)
5. **Check the "Auth" checkbox**
6. **Write down the assigned IP** (e.g., `10.147.20.2`)

### Step 3: Install ZeroTier on Backend Server (3 min)

**On Ubuntu/Debian server:**
```bash
# Install ZeroTier
curl -s https://install.zerotier.com | sudo bash

# Join your network (replace with YOUR network ID)
sudo zerotier-cli join YOUR_NETWORK_ID

# Check status
sudo zerotier-cli listnetworks
```

**Authorize Backend:**
1. Go to https://my.zerotier.com → Your Network
2. Find your backend server in **"Members"**
3. **Check the "Auth" checkbox**
4. **Write down the assigned IP** (e.g., `10.147.20.1`)

**Test Connection:**
```bash
# Ping router via ZeroTier (use router's ZeroTier IP)
ping 10.147.20.2

# Should get replies - if not, see troubleshooting below
```

### Step 4: Configure Backend (2 min)

**Edit `.env` file:**
```bash
cd /path/to/pooh_food_track/backend
nano .env
```

**Update with your settings:**
```env
# Use router's ZeroTier IP (from Step 2)
ROUTER_IP=10.147.20.2

# Your router credentials
ROUTER_USER=admin
ROUTER_PASS=your_password

# Server port
PORT=3000

# Increase timeout for VPN
ROUTER_TIMEOUT=10000
```

**Start backend:**
```bash
npm install
npm start
```

**Look for:**
```
✓ Router connection successful
✓ Successfully authenticated with Cudy LT500 router
```

### Step 5: Test Everything

**Test from another terminal:**
```bash
# Check status
curl http://localhost:3000/api/status

# Send test SMS (replace with your phone number)
curl -X POST http://localhost:3000/api/send-verification-code \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"+1234567890"}'
```

**Check your phone for SMS!** 📱

## Deploying to Render.com

If you want to deploy to Render (cloud hosting):

1. **Set environment variables in Render dashboard:**
   - `ROUTER_IP`: Router's ZeroTier IP (e.g., `10.147.20.2`)
   - `ROUTER_USER`: Router admin username
   - `ROUTER_PASS`: Router admin password
   - `ROUTER_TIMEOUT`: `10000`
   - `ZEROTIER_NETWORK_ID`: Your ZeroTier Network ID

2. **Deploy using render.yaml** (already configured in this repo)

3. **Authorize Render instance:**
   - After deployment, go to ZeroTier dashboard
   - Find new member (Render instance)
   - Check "Auth" to authorize

4. **Test the deployed API:**
   ```bash
   curl https://your-app.onrender.com/api/status
   ```

## Troubleshooting

### Can't ping router via ZeroTier

**Check:**
```bash
# On both devices, verify ZeroTier is running
sudo zerotier-cli info

# Check network status
sudo zerotier-cli listnetworks

# Should show: 200 listnetworks <id> <name> <device> <IP> OK PRIVATE
```

**Solutions:**
1. Verify both devices are **authorized** in ZeroTier dashboard (Auth checkbox)
2. Check ZeroTier service is running: `sudo systemctl status zerotier-one`
3. Restart ZeroTier: `sudo systemctl restart zerotier-one`
4. On router: `/etc/init.d/zerotier restart`

### Backend can't connect to router

**Check backend logs for errors:**
```bash
npm start
# Look for connection errors
```

**Common fixes:**
1. Verify `ROUTER_IP` in `.env` is the **ZeroTier IP**, not local IP
2. Test ping to router: `ping 10.147.20.2`
3. Test HTTP access: `curl http://10.147.20.2/cgi-bin/luci`
4. Check router credentials in `.env`

### SMS not sending

**Verify SMS works manually:**
1. Access router web interface: `http://192.168.10.1` (local) or `http://10.147.20.2` (ZeroTier)
2. Login with admin credentials
3. Go to **Network → GCOM SMS**
4. Send a test SMS manually
5. If manual SMS fails, check:
   - SIM card is inserted correctly
   - SIM has active credit
   - Mobile signal strength is good

## Next Steps

✅ **Production Deployment**: See [DEPLOYMENT.md](DEPLOYMENT.md) for full production setup

✅ **Complete Guide**: See [ZEROTIER_VPN_SETUP.md](ZEROTIER_VPN_SETUP.md) for detailed documentation

✅ **SMS Setup**: See [SMS_SETUP.md](SMS_SETUP.md) for SMS authentication details

## Getting Help

- Check logs: `npm start` or `pm2 logs pooh-sms`
- Verify ZeroTier: `sudo zerotier-cli listnetworks`
- Test router: Access web interface at ZeroTier IP
- Review [ZEROTIER_VPN_SETUP.md](ZEROTIER_VPN_SETUP.md) troubleshooting section

## Security Reminders

⚠️ **Important:**
- Change default router password
- Use strong passwords
- Keep `.env` file secret (never commit to git)
- Set ZeroTier network to "Private" mode
- Regularly check authorized devices in ZeroTier dashboard

---

**Need more help?** Open an issue at: https://github.com/ALEX-SHR-SUDO/pooh_food_track/issues
