#!/bin/bash
# ZeroTier Connection Test Script
# Tests connectivity to ZeroTier network and Cudy LT500 router

set -e

echo "╔════════════════════════════════════════════════╗"
echo "║   ZeroTier Connection Diagnostic Tool         ║"
echo "╚════════════════════════════════════════════════╝"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running in Docker or local
if [ -f /.dockerenv ]; then
    echo "🐳 Running in Docker environment"
    IN_DOCKER=true
else
    echo "💻 Running on local machine"
    IN_DOCKER=false
fi

echo ""

# Test 1: Check if ZeroTier is installed
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Test 1: ZeroTier Installation"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if command -v zerotier-cli &> /dev/null; then
    echo -e "${GREEN}✓${NC} ZeroTier CLI is installed"
    zerotier-cli --version
else
    echo -e "${RED}✗${NC} ZeroTier CLI is not installed"
    echo "   Install from: https://www.zerotier.com/download/"
    exit 1
fi

echo ""

# Test 2: Check ZeroTier service status
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Test 2: ZeroTier Service Status"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if zerotier-cli info &> /dev/null; then
    echo -e "${GREEN}✓${NC} ZeroTier service is running"
    zerotier-cli info
else
    echo -e "${RED}✗${NC} ZeroTier service is not running"
    echo "   Start with: sudo service zerotier-one start"
    exit 1
fi

echo ""

# Test 3: Check network connections
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Test 3: ZeroTier Network Status"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
NETWORKS=$(zerotier-cli listnetworks)
echo "$NETWORKS"
echo ""

# Check if connected to any network
if echo "$NETWORKS" | grep -q "OK"; then
    echo -e "${GREEN}✓${NC} Connected to ZeroTier network(s)"
    
    # Extract network ID and IP
    NETWORK_ID=$(echo "$NETWORKS" | awk 'NR==2 {print $3}')
    ZEROTIER_IP=$(echo "$NETWORKS" | awk 'NR==2 {print $9}')
    
    echo "   Network ID: $NETWORK_ID"
    echo "   Your ZeroTier IP: $ZEROTIER_IP"
else
    echo -e "${YELLOW}⚠${NC} Not connected to any ZeroTier network"
    echo "   Join a network with: zerotier-cli join <NETWORK_ID>"
fi

echo ""

# Test 4: Check router connectivity (if ROUTER_ZEROTIER_IP is set)
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Test 4: Router Connectivity"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -z "$ROUTER_ZEROTIER_IP" ]; then
    echo -e "${YELLOW}⚠${NC} ROUTER_ZEROTIER_IP not set"
    echo "   Set it with: export ROUTER_ZEROTIER_IP=<router_ip>"
    echo "   Example: export ROUTER_ZEROTIER_IP=192.168.192.1"
else
    echo "Testing connection to router at: $ROUTER_ZEROTIER_IP"
    echo ""
    
    # Ping test
    echo -n "   Ping test... "
    if ping -c 3 -W 2 $ROUTER_ZEROTIER_IP &> /dev/null; then
        echo -e "${GREEN}✓${NC} Router responds to ping"
    else
        echo -e "${RED}✗${NC} Router does not respond to ping"
    fi
    
    # HTTP test
    echo -n "   HTTP test (port 80)... "
    if curl -f --max-time 5 "http://$ROUTER_ZEROTIER_IP/cgi-bin/luci" &> /dev/null; then
        echo -e "${GREEN}✓${NC} Router HTTP interface is accessible"
    else
        echo -e "${RED}✗${NC} Router HTTP interface is not accessible"
        echo "      Check if router is:"
        echo "      1. Connected to ZeroTier network"
        echo "      2. Authorized on my.zerotier.com"
        echo "      3. Has correct ZeroTier IP"
    fi
    
    # LuCI interface test
    echo -n "   LuCI interface test... "
    if curl -I --max-time 5 "http://$ROUTER_ZEROTIER_IP/cgi-bin/luci" 2>/dev/null | grep -q "200\|302\|401"; then
        echo -e "${GREEN}✓${NC} LuCI interface is responding"
    else
        echo -e "${RED}✗${NC} LuCI interface is not responding"
    fi
fi

echo ""

# Test 5: Check proxy connectivity (if PORT is set)
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Test 5: Proxy Service Status"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -z "$PORT" ]; then
    echo -e "${YELLOW}⚠${NC} PORT not set, skipping proxy test"
    echo "   Set it with: export PORT=10000"
else
    echo "Testing proxy on localhost:$PORT"
    echo ""
    
    echo -n "   Proxy HTTP test... "
    if curl -f --max-time 5 "http://localhost:$PORT/cgi-bin/luci" &> /dev/null; then
        echo -e "${GREEN}✓${NC} Proxy is working correctly"
    else
        echo -e "${RED}✗${NC} Proxy is not responding"
        echo "      Check if socat proxy is running"
    fi
fi

echo ""

# Summary
echo "╔════════════════════════════════════════════════╗"
echo "║              Test Summary                      ║"
echo "╚════════════════════════════════════════════════╝"
echo ""
echo "Environment Variables:"
echo "   ZEROTIER_NETWORK_ID: ${ZEROTIER_NETWORK_ID:-not set}"
echo "   ROUTER_ZEROTIER_IP: ${ROUTER_ZEROTIER_IP:-not set}"
echo "   PORT: ${PORT:-not set}"
echo ""

# Final recommendations
echo "📝 Recommendations:"
if [ -z "$ROUTER_ZEROTIER_IP" ]; then
    echo "   • Set ROUTER_ZEROTIER_IP environment variable"
fi
if ! echo "$NETWORKS" | grep -q "OK"; then
    echo "   • Join your ZeroTier network"
    echo "   • Authorize device on my.zerotier.com"
fi
if [ ! -z "$ROUTER_ZEROTIER_IP" ]; then
    if ! curl -f --max-time 5 "http://$ROUTER_ZEROTIER_IP/cgi-bin/luci" &> /dev/null; then
        echo "   • Ensure router is connected to ZeroTier"
        echo "   • Check router ZeroTier IP is correct"
        echo "   • Verify router allows traffic from your IP"
    fi
fi

echo ""
echo "For detailed setup instructions, see ZEROTIER_SETUP.md"
echo ""
