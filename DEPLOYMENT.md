# Deployment Guide

## Deploy Backend to Render

### Prerequisites
- GitHub account connected to Render
- Cudy LT500 Router with SMS capabilities
- **Network Access**: Choose one of the following:
  - **Option A (Recommended)**: ZeroTier VPN - Router and backend on same ZeroTier network
  - **Option B**: Port forwarding - Router accessible from the internet
  - **Option C**: Local only - Backend and router on same LAN (not suitable for cloud deployment)
- Router credentials

**For ZeroTier VPN Setup (Recommended):**
1. Complete [ZEROTIER_VPN_SETUP.md](ZEROTIER_VPN_SETUP.md) guide first
2. Note your router's ZeroTier IP address (e.g., `10.147.20.2`)
3. Have your ZeroTier Network ID ready

### Method 1: Auto-Deploy with render.yaml

1. Push your code to GitHub (already includes `render.yaml`)
2. Go to [Render Dashboard](https://dashboard.render.com)
3. Click "New" → "Blueprint"
4. Connect your GitHub repository
5. Render will automatically detect `render.yaml` and create the service

### Method 2: Manual Deploy

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: pooh-food-sms-backend
   - **Root Directory**: `backend`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add Environment Variables:
   - `ROUTER_IP`: 
     - For ZeroTier: Your router's ZeroTier IP (e.g., `10.147.20.2`)
     - For port forwarding: Router's public IP or domain
     - For local: `192.168.10.1` (won't work with cloud deployment)
   - `ROUTER_USER`: Router admin username (default: `admin`)
   - `ROUTER_PASS`: Router admin password (change from default!)
   - `ROUTER_TIMEOUT`: `10000` (recommended for VPN connections)
   - `PORT`: Auto-assigned by Render
6. Click "Create Web Service"

### After Deployment

#### For ZeroTier VPN Setup (Recommended)

1. **Install ZeroTier on Render**
   
   Add a build command to install ZeroTier:
   ```bash
   # In Render dashboard, update Build Command to:
   curl -s https://install.zerotier.com | bash && cd backend && npm install
   ```

2. **Join ZeroTier Network**
   
   Add to Start Command:
   ```bash
   # In Render dashboard, update Start Command to:
   zerotier-cli join YOUR_NETWORK_ID && cd backend && npm start
   ```
   
   Or use a startup script (recommended):
   
   Create `backend/start.sh`:
   ```bash
   #!/bin/bash
   # Install ZeroTier if not present
   if ! command -v zerotier-cli &> /dev/null; then
       curl -s https://install.zerotier.com | bash
   fi
   
   # Join ZeroTier network
   zerotier-cli join YOUR_NETWORK_ID
   
   # Wait for connection
   sleep 5
   
   # Start backend
   node cudy-sms-server.js
   ```
   
   Update Start Command: `bash backend/start.sh`

3. **Authorize in ZeroTier Dashboard**
   - Go to https://my.zerotier.com
   - Select your network
   - Look for new member (Render instance)
   - Check "Auth" to authorize
   - Note the assigned IP

4. **Update Environment Variables**
   - Set `ROUTER_IP` to your router's ZeroTier IP
   - Verify `ROUTER_TIMEOUT` is set to `10000` or higher

5. **Test Connection**
   - Check Render logs for "✓ Router connection successful"
   - Test API: `curl https://your-app.onrender.com/api/status`

#### For Port Forwarding Setup

1. Wait for the build to complete (first build takes 2-3 minutes)
2. Get your backend URL (e.g., `https://pooh-food-sms-backend.onrender.com`)
3. Update your frontend `script.js` with the backend URL
4. Configure your router for external access:
   - Enable port forwarding if needed
   - Whitelist Render's IP range in router firewall
   - Test connectivity from external network

### Troubleshooting Render Deployment

**Build fails with "Cannot find package.json":**
- Ensure `render.yaml` exists in repository root
- Verify build command includes `cd backend &&` prefix
- Check that `backend/package.json` exists

**Service starts but SMS doesn't work:**
- Verify router is accessible (ping router IP from Render shell)
- For ZeroTier: Check both router and Render instance are authorized
- For ZeroTier: Verify ZeroTier connection with `zerotier-cli listnetworks`
- Check environment variables are set correctly (especially ROUTER_IP)
- Review logs in Render dashboard
- Test router API endpoints manually
- Increase ROUTER_TIMEOUT for VPN connections

**502 Bad Gateway or service crashes:**
- Check logs for startup errors
- Verify all dependencies installed correctly
- Ensure PORT environment variable is not hardcoded

## Deploy Frontend to Vercel

### Prerequisites
- Ensure backend is deployed and working (test the `/api/status` endpoint)
- Have backend URL ready (e.g., `https://pooh-food-sms-backend.onrender.com`)

### Vercel Deployment

### Method 1: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy from the project directory:
```bash
vercel
```

4. Follow the prompts and your site will be deployed!

### Method 2: Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will automatically detect the configuration and deploy

### Method 3: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ALEX-SHR-SUDO/pooh_food_track)

## Configuration

The project includes a minimal `vercel.json` file:

```json
{
  "version": 2
}
```

Vercel automatically detects and serves this project as a static site without requiring explicit build configuration.

## Custom Domain

After deployment, you can add a custom domain in your Vercel project settings:

1. Go to your project in Vercel Dashboard
2. Navigate to Settings → Domains
3. Add your custom domain
4. Follow the DNS configuration instructions

## Environment

This is a static HTML/CSS/JavaScript application with no build steps required.

## Features Enabled for Production

- ✅ Thai cultural background with golden silk pattern
- ✅ Professional code structure (separated CSS and JS files)
- ✅ Responsive design for mobile and desktop
- ✅ SEO-friendly meta tags
- ✅ Optimized for Vercel edge network

## Support

For issues with Vercel deployment, visit [Vercel Documentation](https://vercel.com/docs)
