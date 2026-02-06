# POOH Food SMS Backend

Express server for SMS verification using Cudy LT500 4G LTE router.

## Features

- 📱 SMS verification code generation and sending
- 🔐 Secure authentication with Cudy LT500 router
- ⏱️ Code expiry (5 minutes)
- 🔒 Rate limiting and max attempt protection
- 🌐 CORS-enabled for frontend integration
- 💾 In-memory code storage (Redis-ready for production)

## Prerequisites

- Node.js >= 14.0.0
- Cudy LT500 4G LTE router with SIM card
- Router accessible on local network

## Installation

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from template:
```bash
cp .env.example .env
```

4. Configure your router settings in `.env`:
```env
ROUTER_IP=192.168.10.1      # Your router's IP address
ROUTER_USER=admin            # Router admin username
ROUTER_PASS=admin            # Router admin password
PORT=3000                    # Server port
```

## Usage

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on port 3000 (or your configured PORT).

## API Endpoints

### POST /api/send-verification-code
Send verification code via SMS.

**Request:**
```json
{
  "phoneNumber": "+972501234567"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Verification code sent successfully",
  "expiresIn": 300
}
```

### POST /api/verify-code
Verify the SMS code.

**Request:**
```json
{
  "phoneNumber": "+972501234567",
  "code": "1234"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Phone number verified successfully",
  "phoneNumber": "+972501234567"
}
```

### POST /api/send-sms
Send arbitrary SMS message (for testing).

**Request:**
```json
{
  "phoneNumber": "+972501234567",
  "message": "Test message"
}
```

### GET /api/status
Check server and router connectivity.

**Response:**
```json
{
  "success": true,
  "status": "online",
  "routerConnected": true,
  "routerIp": "192.168.10.1",
  "activeCodes": 2
}
```

## Security Features

- **Code Expiry**: Verification codes expire after 5 minutes
- **Max Attempts**: Maximum 3 verification attempts per code
- **Rate Limiting**: 1-minute cooldown between code requests
- **Automatic Cleanup**: Expired codes cleaned every 5 minutes

## Troubleshooting

### Cannot connect to router
1. Verify router IP address is correct
2. Check router is powered on and accessible
3. Test connectivity: `ping 192.168.10.1`
4. Verify router admin credentials

### SMS not being sent
1. Check SIM card is inserted and has credit
2. Verify mobile network signal strength
3. Check router SMS settings in web interface
4. Review server logs for errors

### Authentication fails
1. Verify router username and password in `.env`
2. Check router is running OpenWRT/LuCI
3. Try accessing router web interface manually
4. Review authentication logs

## Production Deployment

For production use, consider:
- Use Redis or database for code storage
- Add HTTPS/TLS encryption
- Implement JWT for session management
- Add comprehensive logging
- Use PM2 for process management
- Set up Nginx reverse proxy

See main `SMS_SETUP.md` for full deployment instructions.

## Dependencies

- `express`: Web server framework
- `cors`: CORS middleware
- `node-fetch@2.7.0`: HTTP client (v2 for CommonJS)
- `tough-cookie`: Cookie handling
- `fetch-cookie`: Cookie-aware fetch
- `dotenv`: Environment configuration

## License

MIT
