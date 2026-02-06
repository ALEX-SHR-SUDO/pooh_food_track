/**
 * Cudy SMS Server
 * Express server for handling SMS verification codes through Cudy LT500 router
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const CudyLT500_API = require('./cudy-lt500-api');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Cudy Router API
const routerApi = new CudyLT500_API(
    process.env.ROUTER_IP || '192.168.10.1',
    process.env.ROUTER_USER || 'admin',
    process.env.ROUTER_PASS || 'admin',
    process.env.ROUTER_PROTOCOL || 'http'
);

// In-memory storage for verification codes
// In production, use Redis or a database
const verificationCodes = new Map();

// Configuration
const CODE_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes
const MAX_ATTEMPTS = 3;
const CODE_LENGTH = 4;

/**
 * Generate a random 4-digit verification code
 */
function generateVerificationCode() {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

/**
 * Clean expired verification codes
 */
function cleanExpiredCodes() {
    const now = Date.now();
    for (const [phone, data] of verificationCodes.entries()) {
        if (now - data.timestamp > CODE_EXPIRY_MS) {
            verificationCodes.delete(phone);
            console.log(`Cleaned expired code for: ${phone}`);
        }
    }
}

// Clean expired codes every 5 minutes
setInterval(cleanExpiredCodes, 5 * 60 * 1000);

/**
 * POST /api/send-verification-code
 * Generate and send verification code via SMS
 */
app.post('/api/send-verification-code', async (req, res) => {
    try {
        const { phoneNumber } = req.body;

        if (!phoneNumber) {
            return res.status(400).json({
                success: false,
                error: 'Phone number is required'
            });
        }

        // Validate phone number format (basic validation)
        const phoneRegex = /^\+?[1-9]\d{1,14}$/;
        if (!phoneRegex.test(phoneNumber)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid phone number format'
            });
        }

        // Check rate limiting - prevent sending too many codes
        const existingCode = verificationCodes.get(phoneNumber);
        if (existingCode) {
            const timeSinceLastCode = Date.now() - existingCode.timestamp;
            if (timeSinceLastCode < 60000) { // 1 minute cooldown
                return res.status(429).json({
                    success: false,
                    error: 'Please wait before requesting a new code',
                    retryAfter: Math.ceil((60000 - timeSinceLastCode) / 1000)
                });
            }
        }

        // Generate verification code
        const code = generateVerificationCode();
        
        // Prepare SMS message
        const message = `🍽️ POOH Food\nВаш код: ${code}\nДействителен 5 минут`;
        
        // Send SMS through router
        const smsSent = await routerApi.sendSMS(phoneNumber, message);
        
        if (!smsSent) {
            return res.status(500).json({
                success: false,
                error: 'Failed to send SMS. Please try again later.'
            });
        }

        // Store verification code
        verificationCodes.set(phoneNumber, {
            code: code,
            timestamp: Date.now(),
            attempts: 0
        });

        console.log(`✓ Verification code sent to ${phoneNumber}`);

        res.json({
            success: true,
            message: 'Verification code sent successfully',
            expiresIn: CODE_EXPIRY_MS / 1000 // seconds
        });

    } catch (error) {
        console.error('Error sending verification code:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

/**
 * POST /api/verify-code
 * Verify the SMS code entered by user
 */
app.post('/api/verify-code', (req, res) => {
    try {
        const { phoneNumber, code } = req.body;

        if (!phoneNumber || !code) {
            return res.status(400).json({
                success: false,
                error: 'Phone number and code are required'
            });
        }

        const storedData = verificationCodes.get(phoneNumber);

        if (!storedData) {
            return res.status(404).json({
                success: false,
                error: 'No verification code found. Please request a new code.'
            });
        }

        // Check if code has expired
        const now = Date.now();
        if (now - storedData.timestamp > CODE_EXPIRY_MS) {
            verificationCodes.delete(phoneNumber);
            return res.status(410).json({
                success: false,
                error: 'Verification code has expired. Please request a new code.'
            });
        }

        // Check max attempts
        if (storedData.attempts >= MAX_ATTEMPTS) {
            verificationCodes.delete(phoneNumber);
            return res.status(429).json({
                success: false,
                error: 'Maximum verification attempts exceeded. Please request a new code.'
            });
        }

        // Verify code
        if (storedData.code === code) {
            // Success - remove code from storage
            verificationCodes.delete(phoneNumber);
            console.log(`✓ Phone verified successfully: ${phoneNumber}`);
            
            return res.json({
                success: true,
                message: 'Phone number verified successfully',
                phoneNumber: phoneNumber
            });
        } else {
            // Incorrect code - increment attempts
            storedData.attempts++;
            verificationCodes.set(phoneNumber, storedData);
            
            const attemptsLeft = MAX_ATTEMPTS - storedData.attempts;
            console.log(`✗ Invalid code for ${phoneNumber}. Attempts left: ${attemptsLeft}`);
            
            return res.status(400).json({
                success: false,
                error: 'Invalid verification code',
                attemptsLeft: attemptsLeft
            });
        }

    } catch (error) {
        console.error('Error verifying code:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

/**
 * POST /api/send-sms
 * Send arbitrary SMS (for testing or other purposes)
 */
app.post('/api/send-sms', async (req, res) => {
    try {
        const { phoneNumber, message } = req.body;

        if (!phoneNumber || !message) {
            return res.status(400).json({
                success: false,
                error: 'Phone number and message are required'
            });
        }

        const smsSent = await routerApi.sendSMS(phoneNumber, message);
        
        if (smsSent) {
            res.json({
                success: true,
                message: 'SMS sent successfully'
            });
        } else {
            res.status(500).json({
                success: false,
                error: 'Failed to send SMS'
            });
        }

    } catch (error) {
        console.error('Error sending SMS:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

/**
 * GET /api/health
 * Health check endpoint for monitoring
 */
app.get('/api/health', async (req, res) => {
    try {
        const isConnected = await routerApi.checkConnection();
        
        res.json({
            status: isConnected ? 'healthy' : 'unhealthy',
            router: {
                ip: process.env.ROUTER_IP || '192.168.10.1',
                protocol: process.env.ROUTER_PROTOCOL || 'http',
                connected: isConnected
            },
            environment: process.env.NODE_ENV || 'development',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Health check error:', error);
        res.status(503).json({
            status: 'unhealthy',
            error: 'Health check failed',
            environment: process.env.NODE_ENV || 'development'
        });
    }
});

/**
 * GET /api/router-status
 * Detailed router status information
 */
app.get('/api/router-status', async (req, res) => {
    try {
        const isConnected = await routerApi.checkConnection();
        
        res.json({
            success: true,
            router: {
                ip: process.env.ROUTER_IP || '192.168.10.1',
                protocol: process.env.ROUTER_PROTOCOL || 'http',
                connected: isConnected,
                authenticated: routerApi.isAuthenticated,
                baseUrl: routerApi.baseUrl
            },
            activeCodes: verificationCodes.size,
            environment: process.env.NODE_ENV || 'development',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Router status check error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to check router status'
        });
    }
});

/**
 * GET /api/status
 * Check router connectivity and server status
 */
app.get('/api/status', async (req, res) => {
    try {
        const isConnected = await routerApi.checkConnection();
        
        res.json({
            success: true,
            status: 'online',
            routerConnected: isConnected,
            routerIp: process.env.ROUTER_IP || '192.168.10.1',
            activeCodes: verificationCodes.size
        });

    } catch (error) {
        console.error('Error checking status:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to check status'
        });
    }
});

/**
 * GET / 
 * Health check endpoint
 */
app.get('/', (req, res) => {
    res.json({
        service: 'Cudy SMS Server',
        version: '1.0.0',
        status: 'running'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});

// Start server
app.listen(PORT, () => {
    const environment = process.env.NODE_ENV || 'development';
    const routerConfig = `${process.env.ROUTER_PROTOCOL || 'http'}://${process.env.ROUTER_IP || '192.168.10.1'}`;
    
    console.log(`
╔═══════════════════════════════════════════════╗
║     🍽️  POOH Food SMS Server                  ║
║     🚀 Server running on port ${PORT}          ║
║     📱 Cudy LT500 SMS Gateway Active          ║
║     🌍 Environment: ${environment.padEnd(12)}         ║
║     🔗 Router: ${routerConfig.padEnd(30)} ║
╚═══════════════════════════════════════════════╝
    `);
    
    // Test router connection on startup
    routerApi.checkConnection().then(isConnected => {
        if (isConnected) {
            console.log('✓ Router connection successful');
        } else {
            console.log('⚠ Warning: Cannot connect to router. Please check configuration.');
            console.log(`   Router URL: ${routerConfig}`);
            console.log(`   Environment: ${environment}`);
            if (environment === 'production') {
                console.log('   💡 Make sure ZeroTier gateway is running and router is connected to ZeroTier network');
            }
        }
    });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down gracefully...');
    await routerApi.logout();
    process.exit(0);
});

process.on('SIGINT', async () => {
    console.log('\nSIGINT received, shutting down gracefully...');
    await routerApi.logout();
    process.exit(0);
});
