#!/bin/bash

echo "🧪 Testing ZeroTier connection..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if ROUTER_ZEROTIER_IP is set
if [ -z "$ROUTER_ZEROTIER_IP" ]; then
    echo -e "${RED}❌ Error: ROUTER_ZEROTIER_IP environment variable is not set${NC}"
    exit 1
fi

echo "📡 Router ZeroTier IP: $ROUTER_ZEROTIER_IP"
echo ""

# Test 1: Ping
echo "Test 1: Ping router..."
if ping -c 3 -W 5 $ROUTER_ZEROTIER_IP > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Ping successful${NC}"
else
    echo -e "${RED}❌ Ping failed${NC}"
    echo "💡 Make sure router is authorized on my.zerotier.com"
fi

echo ""

# Test 2: HTTP connection
echo "Test 2: HTTP connection..."
if curl -f -s -o /dev/null -w "%{http_code}" http://$ROUTER_ZEROTIER_IP/cgi-bin/luci | grep -q "200\|401"; then
    echo -e "${GREEN}✅ HTTP connection successful${NC}"
else
    echo -e "${RED}❌ HTTP connection failed${NC}"
fi

echo ""

# Test 3: ZeroTier status
echo "Test 3: ZeroTier status..."
zerotier-cli listnetworks

echo ""
echo "✅ Test complete!"
