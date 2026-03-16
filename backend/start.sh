#!/bin/bash

# POOH Food WhatsApp Server Startup Script

set -e  # Exit on error

echo "========================================"
echo "  POOH Food WhatsApp Server Startup"
echo "========================================"

echo ""
echo "🚀 Starting POOH Food WhatsApp Server..."
echo "   Port: ${PORT:-3000}"
echo ""

# Start the Node.js server
exec node whatsapp-server.js
