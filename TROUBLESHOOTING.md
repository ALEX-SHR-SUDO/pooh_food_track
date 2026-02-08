# Cudy LT500 + ZeroTier VPN - Service Not Working Checklist ✅

This checklist will help you diagnose and fix issues with your POOH Food service using Cudy LT500 router with ZeroTier VPN.

## 📋 Pre-Flight Check

Before troubleshooting, verify you have:
- [ ] Cudy LT500 router with OpenWRT firmware
- [ ] Active SIM card with SMS capability and credit
- [ ] ZeroTier account and network created
- [ ] Backend server (VPS, Render, or local)
- [ ] Node.js installed on backend server

## 🔍 Step-by-Step Troubleshooting

### Step 1: Check Router Basic Functionality ✅

**Test router web interface:**
```bash
# From local network
curl -I http://192.168.10.1/cgi-bin/luci
```

**Expected:** HTTP 200 or 401 (means router is responding)

**If fails:**
- [ ] Check router is powered on
- [ ] Verify you're connected to router's network
- [ ] Try accessing via browser: http://192.168.10.1
- [ ] Check router lights (4G, WiFi, Power)

### Step 2: Check SIM Card and SMS ✅

**Test SMS manually:**
1. Access router: http://192.168.10.1
2. Login: admin / your_password
3. Go to: Network → GCOM SMS
4. Send test SMS to your phone

**If SMS fails:**
- [ ] Check SIM card is inserted correctly
- [ ] Verify SIM has active credit (check with your carrier)
- [ ] Check 4G signal strength (need at least 2 bars)
- [ ] Try rebooting router
- [ ] Contact your mobile carrier if still failing

### Step 3: Check ZeroTier on Router ✅

**SSH into router:**
```bash
ssh root@192.168.10.1
# Enter your router password
```

**Check ZeroTier status:**
```bash
# Check if installed
which zerotier-cli

# If not installed, install it:
opkg update
opkg install zerotier

# Enable and start
/etc/init.d/zerotier enable
/etc/init.d/zerotier start

# Check service status
/etc/init.d/zerotier status

# Check ZeroTier info
zerotier-cli info
```

**Expected output:**
```
200 info <node_id> 1.x.x ONLINE
```

**Check network status:**
```bash
zerotier-cli listnetworks
```

**Expected output:**
```
200 listnetworks <network_id> <name> <device> <zt_ip> OK PRIVATE
```

**If shows ACCESS_DENIED or NOT_FOUND:**
- [ ] Join network: `zerotier-cli join YOUR_NETWORK_ID`
- [ ] Go to https://my.zerotier.com
- [ ] Find router in Members list
- [ ] Check the "Auth" checkbox to authorize

**Check router's ZeroTier IP:**
```bash
ip addr show zt+
# Look for inet IP address (e.g., 10.147.20.2)
```

**Write down this IP - you'll need it!** 📝

### Step 4: Check ZeroTier on Backend Server ✅

**Check ZeroTier status:**
```bash
# Check if installed
which zerotier-cli

# If not installed:
curl -s https://install.zerotier.com | sudo bash

# Check status
sudo zerotier-cli info
```

**Expected:**
```
200 info <node_id> 1.x.x ONLINE
```

**Check network:**
```bash
sudo zerotier-cli listnetworks
```

**Expected:**
```
200 listnetworks <network_id> <name> <device> <zt_ip> OK PRIVATE
```

**If not connected:**
- [ ] Join network: `sudo zerotier-cli join YOUR_NETWORK_ID`
- [ ] Authorize at https://my.zerotier.com
- [ ] Check "Auth" checkbox
- [ ] Wait 10 seconds, check again

**Check backend's ZeroTier IP:**
```bash
ip addr show zt+
# Look for inet IP address (e.g., 10.147.20.1)
```

### Step 5: Test Network Connection Between Devices ✅

**From backend server, ping router:**
```bash
# Use router's ZeroTier IP (from Step 3)
ping -c 4 10.147.20.2
```

**Expected:**
```
4 packets transmitted, 4 received, 0% packet loss
```

**If ping fails:**
- [ ] Verify both devices show "OK" in `zerotier-cli listnetworks`
- [ ] Verify both devices authorized in ZeroTier dashboard
- [ ] Check router firewall:
  ```bash
  # On router
  /etc/init.d/firewall stop
  # Try ping again from backend
  # If works, firewall is blocking
  /etc/init.d/firewall start
  ```
- [ ] Restart ZeroTier on both devices
- [ ] Check ZeroTier dashboard shows both devices online

**Test HTTP connection:**
```bash
# Use router's ZeroTier IP
curl -I http://10.147.20.2/cgi-bin/luci
```

**Expected:** HTTP 200 or 401

**If fails:**
- [ ] Double-check router IP is correct
- [ ] Verify router web interface is enabled
- [ ] Check router firewall settings

### Step 6: Check Backend Configuration ✅

**Verify .env file:**
```bash
cd /path/to/pooh_food_track/backend
cat .env
```

**Should contain:**
```env
ROUTER_IP=10.147.20.2        # Router's ZeroTier IP (from Step 3)
ROUTER_USER=admin
ROUTER_PASS=your_password    # Not default!
PORT=3000
ROUTER_TIMEOUT=10000
```

**Checklist:**
- [ ] ROUTER_IP is set to router's **ZeroTier IP** (not 192.168.10.1)
- [ ] ROUTER_USER is correct
- [ ] ROUTER_PASS is correct (not still 'admin'!)
- [ ] ROUTER_TIMEOUT is at least 10000 for VPN

**Test backend startup:**
```bash
cd /path/to/pooh_food_track/backend
npm install
npm start
```

**Look for these messages:**
```
✓ Router connection successful
✓ Successfully authenticated with Cudy LT500 router
```

**If see errors:**
- [ ] Check error message carefully
- [ ] Verify ROUTER_IP, ROUTER_USER, ROUTER_PASS
- [ ] Test router accessible: `curl http://<ROUTER_IP>/cgi-bin/luci`
- [ ] Check router credentials by logging into web interface

### Step 7: Test Backend API ✅

**Test status endpoint:**
```bash
curl http://localhost:3000/api/status
```

**Expected:**
```json
{
  "success": true,
  "status": "online",
  "routerConnected": true,
  "routerIp": "10.147.20.2",
  "activeCodes": 0
}
```

**If routerConnected is false:**
- [ ] Go back to Step 6 and verify configuration
- [ ] Check backend logs for connection errors
- [ ] Test router manually: `curl http://<ROUTER_IP>/cgi-bin/luci`

**Test SMS sending:**
```bash
curl -X POST http://localhost:3000/api/send-verification-code \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"+1234567890"}'
```

**Replace +1234567890 with your actual phone number!**

**Expected:**
```json
{
  "success": true,
  "message": "Verification code sent successfully",
  "expiresIn": 300
}
```

**Check your phone - SMS should arrive within 10-30 seconds!** 📱

**If fails:**
- [ ] Check backend logs for error details
- [ ] Verify phone number format (must include + and country code)
- [ ] Test SMS manually via router web interface
- [ ] Check SIM card credit
- [ ] Verify 4G signal strength

### Step 8: Verify Frontend Connection ✅

**Update frontend with backend URL:**

If backend is local:
```javascript
// In script.js
this.SMS_API_URL = 'http://localhost:3000';
```

If backend is on VPS/Render:
```javascript
// In script.js
this.SMS_API_URL = 'https://your-backend-url.com';
```

**Test frontend:**
1. Open index.html in browser
2. Click "เข้าสู่ระบบด้วยเบอร์โทร"
3. Enter your phone number
4. Click send code button

**Expected:**
- Modal shows "sending..."
- SMS arrives on phone
- Modal prompts for code

**If fails:**
- [ ] Check browser console for errors (F12)
- [ ] Verify SMS_API_URL is correct
- [ ] Test backend directly with curl (Step 7)
- [ ] Check CORS errors (backend should allow frontend domain)

## 🚀 Production Deployment Checklist

If deploying to Render.com:

- [ ] Environment variables set in Render dashboard:
  - `ROUTER_IP` = Router's ZeroTier IP
  - `ROUTER_USER` = Router admin username
  - `ROUTER_PASS` = Router admin password
  - `ROUTER_TIMEOUT` = 10000
  - `ZEROTIER_NETWORK_ID` = Your ZeroTier network ID

- [ ] Start command includes ZeroTier setup:
  - Use `bash backend/start.sh` as start command
  - Or manually install ZeroTier in build command

- [ ] After deployment:
  - [ ] Check Render logs for "✓ Connected to ZeroTier network"
  - [ ] Authorize Render instance in ZeroTier dashboard
  - [ ] Test API: `curl https://your-app.onrender.com/api/status`

## ✅ Common Issues and Quick Fixes

### Issue: "Cannot install ZeroTier on router"
**Solution:**
```bash
# Try alternative repository
opkg update
opkg list | grep zerotier
# If not found, add custom feed or use different OpenWRT version
```

### Issue: "ZeroTier shows REQUESTING_CONFIGURATION"
**Solution:**
- Go to https://my.zerotier.com
- Find device in Members list
- Check the "Auth" checkbox
- Wait 10-30 seconds

### Issue: "High ping times on ZeroTier (>500ms)"
**Solution:**
- Check if using RELAY vs DIRECT connection: `zerotier-cli listpeers`
- If RELAY, check firewall allows UDP port 9993
- Try: `sudo ufw allow 9993/udp` on backend
- On router, ensure 9993/udp is allowed

### Issue: "Backend starts but can't authenticate with router"
**Solution:**
```bash
# Test router login manually
curl -X POST http://10.147.20.2/cgi-bin/luci \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "luci_username=admin&luci_password=your_password"

# If fails, verify credentials by logging in via browser
```

### Issue: "SMS arrives but verification fails"
**Solution:**
- Check code hasn't expired (5 minute timeout)
- Verify code entered correctly
- Check backend logs for verification attempts
- Clear browser localStorage and try again

## 📚 Additional Resources

- **Complete Setup**: [GETTING_STARTED.md](GETTING_STARTED.md)
- **Quick Start**: [QUICKSTART_ZEROTIER.md](QUICKSTART_ZEROTIER.md)
- **Detailed VPN Guide**: [ZEROTIER_VPN_SETUP.md](ZEROTIER_VPN_SETUP.md)
- **SMS Setup**: [SMS_SETUP.md](SMS_SETUP.md)
- **Deployment**: [DEPLOYMENT.md](DEPLOYMENT.md)

## 🆘 Still Not Working?

If you've gone through this entire checklist and it's still not working:

1. **Collect Information:**
   - Backend logs: `npm start` output
   - Router ZeroTier status: `zerotier-cli info` and `zerotier-cli listnetworks`
   - Backend ZeroTier status: same commands
   - Ping test results
   - Error messages

2. **Open an Issue:**
   - Go to: https://github.com/ALEX-SHR-SUDO/pooh_food_track/issues
   - Click "New Issue"
   - Provide all information from step 1
   - Include your .env file (with passwords removed!)

3. **Double Check:**
   - [ ] Router has good 4G signal
   - [ ] SIM card has active credit
   - [ ] Both devices authorized in ZeroTier
   - [ ] ROUTER_IP in .env is ZeroTier IP
   - [ ] Router credentials are correct
   - [ ] Backend can ping router
   - [ ] SMS works manually via router interface

## ✨ Success Checklist

When everything is working, you should have:

- ✅ Router connected to ZeroTier with "OK" status
- ✅ Backend connected to ZeroTier with "OK" status
- ✅ Backend can ping router via ZeroTier
- ✅ Backend starts with "Router connection successful" message
- ✅ `/api/status` shows `"routerConnected": true`
- ✅ SMS arrives on phone when testing
- ✅ Frontend can send and verify codes
- ✅ Users can successfully login and order food

**Congratulations! Your service is now working!** 🎉

---

**Need more help?** See [GETTING_STARTED.md](GETTING_STARTED.md) or open an issue on GitHub.
