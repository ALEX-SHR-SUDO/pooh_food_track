#!/bin/bash
# Test ZeroTier connection to router

echo "🔍 Testing ZeroTier Connection..."

if [ -z "$1" ]; then
    echo "Usage: $0 <router-zerotier-ip>"
    exit 1
fi

ROUTER_IP=$1

echo "📡 Pinging router at $ROUTER_IP..."
if ping -c 3 $ROUTER_IP; then
    echo "✅ Ping successful!"
else
    echo "❌ Ping failed!"
    exit 1
fi

echo "🌐 Testing HTTP connection..."
if curl -s -o /dev/null -w "%{http_code}" http://$ROUTER_IP/cgi-bin/luci | grep -q "200\|401"; then
    echo "✅ HTTP connection successful!"
else
    echo "❌ HTTP connection failed!"
    exit 1
fi

echo "🎉 All tests passed!"
