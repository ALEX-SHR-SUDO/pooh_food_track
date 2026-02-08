#!/bin/bash

# POOH Food SMS Server Startup Script
# This script handles ZeroTier VPN setup and starts the backend server

set -e  # Exit on error

echo "========================================"
echo "  POOH Food SMS Server Startup"
echo "========================================"

# Check if ZEROTIER_NETWORK_ID is set
if [ -n "$ZEROTIER_NETWORK_ID" ]; then
    echo "📡 ZeroTier VPN Configuration Detected"
    
    # Install ZeroTier if not present
    if ! command -v zerotier-cli &> /dev/null; then
        echo "📥 Installing ZeroTier..."
        curl -s https://install.zerotier.com | bash
        
        if [ $? -eq 0 ]; then
            echo "✓ ZeroTier installed successfully"
        else
            echo "❌ Failed to install ZeroTier"
            echo "⚠️  Continuing without ZeroTier..."
        fi
    else
        echo "✓ ZeroTier already installed"
    fi
    
    # Join ZeroTier network
    if command -v zerotier-cli &> /dev/null; then
        echo "🔗 Joining ZeroTier network: $ZEROTIER_NETWORK_ID"
        zerotier-cli join "$ZEROTIER_NETWORK_ID" 2>/dev/null || true
        
        # Wait for connection (max 10 seconds)
        echo "⏳ Waiting for ZeroTier connection..."
        for i in {1..10}; do
            if zerotier-cli listnetworks 2>/dev/null | grep -q "OK"; then
                echo "✓ Connected to ZeroTier network"
                zerotier-cli listnetworks
                break
            fi
            sleep 1
        done
        
        echo "⚠️  Note: Ensure this instance is authorized in ZeroTier dashboard!"
        echo "   Go to: https://my.zerotier.com"
    fi
else
    echo "ℹ️  No ZeroTier configuration (ZEROTIER_NETWORK_ID not set)"
    echo "   Using direct connection to router at $ROUTER_IP"
fi

echo ""
echo "🚀 Starting POOH Food SMS Server..."
echo "   Router IP: ${ROUTER_IP:-192.168.10.1}"
echo "   Port: ${PORT:-3000}"
echo ""

# Start the Node.js server
exec node cudy-sms-server.js
