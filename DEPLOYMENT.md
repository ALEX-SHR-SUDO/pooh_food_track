# Deployment Guide

## Deploy Backend to Render

### Prerequisites
- GitHub account connected to Render
- Cudy LT500 Router accessible from the internet (with port forwarding configured)
- Router credentials

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
   - `ROUTER_IP`: Your Cudy router's public IP or domain
   - `ROUTER_USER`: Router admin username (default: admin)
   - `ROUTER_PASS`: Router admin password
   - `PORT`: Auto-assigned by Render
6. Click "Create Web Service"

### After Deployment

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
- Verify router is accessible from internet
- Check environment variables are set correctly
- Review logs in Render dashboard
- Test router API endpoints manually

**502 Bad Gateway or service crashes:**
- Check logs for startup errors
- Verify all dependencies installed correctly
- Ensure PORT environment variable is not hardcoded

## Deploy Frontend to Vercel

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
