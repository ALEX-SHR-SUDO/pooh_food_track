#!/bin/bash

set -e

echo "🚀 Starting ZeroTier Gateway..."

# Проверка обязательных переменных
if [ -z "$ZEROTIER_NETWORK_ID" ]; then
    echo "❌ Error: ZEROTIER_NETWORK_ID environment variable is required"
    exit 1
fi

if [ -z "$ROUTER_ZEROTIER_IP" ]; then
    echo "❌ Error: ROUTER_ZEROTIER_IP environment variable is required"
    exit 1
fi

# Запуск ZeroTier One
echo "📡 Starting ZeroTier One daemon..."
zerotier-one -d

# Ожидание запуска демона
echo "⏳ Waiting for ZeroTier daemon to start..."
sleep 5

# Проверка статуса
if ! zerotier-cli info > /dev/null 2>&1; then
    echo "❌ Error: ZeroTier daemon failed to start"
    exit 1
fi

echo "✅ ZeroTier daemon started successfully"
zerotier-cli info

# Подключение к сети
echo "🌐 Joining ZeroTier network: $ZEROTIER_NETWORK_ID"
zerotier-cli join $ZEROTIER_NETWORK_ID

# Ожидание получения IP адреса
echo "⏳ Waiting for ZeroTier network connection..."
MAX_WAIT=60
COUNTER=0

while [ $COUNTER -lt $MAX_WAIT ]; do
    if zerotier-cli listnetworks | grep -q "OK"; then
        echo "✅ Connected to ZeroTier network!"
        zerotier-cli listnetworks
        break
    fi
    
    echo "⏳ Still waiting... ($COUNTER/$MAX_WAIT seconds)"
    sleep 5
    COUNTER=$((COUNTER + 5))
done

if [ $COUNTER -ge $MAX_WAIT ]; then
    echo "⚠️  Warning: Network connection timeout, but continuing..."
    echo "📋 Make sure to authorize this device on https://my.zerotier.com"
fi

# Проверка доступности роутера
echo "🔍 Testing connection to router at $ROUTER_ZEROTIER_IP..."
if ping -c 3 -W 5 $ROUTER_ZEROTIER_IP > /dev/null 2>&1; then
    echo "✅ Router is reachable via ZeroTier!"
else
    echo "⚠️  Warning: Cannot ping router. This is normal if not yet authorized."
    echo "📋 Authorize this device on https://my.zerotier.com"
fi

# Запуск HTTP прокси к роутеру
echo "🔄 Starting HTTP proxy to router..."
echo "   Listening on: 0.0.0.0:10000"
echo "   Forwarding to: $ROUTER_ZEROTIER_IP:80"

# Создание простого health check endpoint
(while true; do 
    echo -e "HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: 2\r\n\r\nOK" | nc -l -p 8080 -q 1
done) &

# Запуск socat прокси (блокирующий вызов)
exec socat -d -d TCP-LISTEN:10000,fork,reuseaddr TCP:$ROUTER_ZEROTIER_IP:80
