#!/bin/bash
set -e

echo "🚀 Starting ZeroTier Gateway..."
echo "================================"

# Validate required environment variables
if [ -z "$ZEROTIER_NETWORK_ID" ]; then
    echo "❌ ERROR: ZEROTIER_NETWORK_ID environment variable is required"
    exit 1
fi

if [ -z "$ROUTER_ZEROTIER_IP" ]; then
    echo "❌ ERROR: ROUTER_ZEROTIER_IP environment variable is required"
    exit 1
fi

if [ -z "$PORT" ]; then
    echo "⚠️  WARNING: PORT not set, using default 10000"
    PORT=10000
fi

echo "📋 Configuration:"
echo "   Network ID: $ZEROTIER_NETWORK_ID"
echo "   Router IP: $ROUTER_ZEROTIER_IP"
echo "   Proxy Port: $PORT"
echo ""

# Start ZeroTier daemon
echo "🔧 Starting ZeroTier daemon..."
zerotier-one -d

# Wait for daemon to initialize
sleep 5

# Join ZeroTier network
echo "🔗 Joining ZeroTier network: $ZEROTIER_NETWORK_ID"
zerotier-cli join $ZEROTIER_NETWORK_ID

# Wait for network connection (up to 60 seconds)
echo "⏳ Waiting for ZeroTier connection..."
CONNECTED=false
for i in {1..12}; do
    if zerotier-cli listnetworks | grep -q "OK"; then
        echo "✅ Connected to ZeroTier network!"
        CONNECTED=true
        break
    fi
    echo "   Attempt $i/12 - waiting..."
    sleep 5
done

if [ "$CONNECTED" = false ]; then
    echo "❌ ERROR: Failed to connect to ZeroTier network"
    echo "   Please check:"
    echo "   1. Network ID is correct"
    echo "   2. Device is authorized on my.zerotier.com"
    echo "   3. Network configuration allows this device"
    exit 1
fi

# Display ZeroTier status
echo ""
echo "📊 ZeroTier Status:"
zerotier-cli listnetworks
echo ""

# Get our ZeroTier IP
ZEROTIER_IP=$(zerotier-cli listnetworks | awk 'NR==2 {print $9}')
echo "🌐 Our ZeroTier IP: $ZEROTIER_IP"
echo ""

# Test connection to router
echo "🔍 Testing connection to router at $ROUTER_ZEROTIER_IP..."
ROUTER_REACHABLE=false
for i in {1..5}; do
    if curl -f --max-time 10 "http://$ROUTER_ZEROTIER_IP/cgi-bin/luci" > /dev/null 2>&1; then
        echo "✅ Router is reachable via ZeroTier!"
        ROUTER_REACHABLE=true
        break
    fi
    echo "   Attempt $i/5 - router not responding yet..."
    sleep 5
done

if [ "$ROUTER_REACHABLE" = false ]; then
    echo "⚠️  WARNING: Cannot reach router yet"
    echo "   This is normal if the router just joined the network"
    echo "   The proxy will continue trying to connect..."
fi

echo ""
echo "🔄 Starting HTTP proxy on port $PORT..."
echo "   Forwarding: 0.0.0.0:$PORT -> $ROUTER_ZEROTIER_IP:80"
echo ""
echo "✅ ZeroTier Gateway is ready!"
echo "================================"
echo ""

# Start socat proxy with error handling and logging
exec socat -d -d TCP-LISTEN:$PORT,fork,reuseaddr TCP:$ROUTER_ZEROTIER_IP:80
