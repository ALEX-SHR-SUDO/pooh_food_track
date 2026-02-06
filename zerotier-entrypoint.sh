#!/bin/sh
set -e

echo "🚀 Starting ZeroTier Gateway..."

# Check required environment variables
if [ -z "$ZEROTIER_NETWORK_ID" ]; then
    echo "❌ Error: ZEROTIER_NETWORK_ID is required!"
    exit 1
fi

if [ -z "$ROUTER_ZEROTIER_IP" ]; then
    echo "❌ Error: ROUTER_ZEROTIER_IP is required!"
    exit 1
fi

# Start ZeroTier service
echo "📡 Starting ZeroTier One service..."
zerotier-one -d

# Wait for service to start
sleep 5

# Join ZeroTier network
echo "🔗 Joining ZeroTier network: $ZEROTIER_NETWORK_ID"
zerotier-cli join $ZEROTIER_NETWORK_ID

# Wait for network connection
echo "⏳ Waiting for ZeroTier network connection..."
MAX_ATTEMPTS=30
ATTEMPT=0

while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
    if zerotier-cli listnetworks | grep -q "OK"; then
        echo "✅ Connected to ZeroTier network!"
        zerotier-cli listnetworks
        break
    fi
    ATTEMPT=$((ATTEMPT + 1))
    echo "   Attempt $ATTEMPT/$MAX_ATTEMPTS..."
    sleep 2
done

if [ $ATTEMPT -eq $MAX_ATTEMPTS ]; then
    echo "❌ Failed to connect to ZeroTier network after $MAX_ATTEMPTS attempts"
    zerotier-cli listnetworks
    exit 1
fi

# Get our ZeroTier IP
MY_ZT_IP=$(zerotier-cli listnetworks | grep $ZEROTIER_NETWORK_ID | awk '{print $9}')
echo "📍 Our ZeroTier IP: $MY_ZT_IP"

# Test connectivity to router
echo "🔍 Testing connectivity to router at $ROUTER_ZEROTIER_IP..."
if ping -c 3 $ROUTER_ZEROTIER_IP > /dev/null 2>&1; then
    echo "✅ Router is reachable via ZeroTier!"
else
    echo "⚠️  Warning: Cannot ping router. Continuing anyway..."
fi

# Start HTTP proxy to router
echo "🔄 Starting HTTP proxy: localhost:10000 -> $ROUTER_ZEROTIER_IP:80"
exec socat TCP-LISTEN:10000,fork,reuseaddr TCP:"$ROUTER_ZEROTIER_IP":80
