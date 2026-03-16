/**
 * WhatsApp Verification Server
 * Express server for handling verification codes via Twilio WhatsApp API
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const twilio = require('twilio');

const app = express();
const PORT = process.env.PORT || 3000;

// Twilio WhatsApp client
const twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);
const WHATSAPP_FROM = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory storage for verification codes
// In production, use Redis or a database
const verificationCodes = new Map();

// Configuration
const CODE_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes
const MAX_ATTEMPTS = 3;

/**
 * Generate a cryptographically secure random 4-digit verification code
 */
function generateVerificationCode() {
    return (1000 + crypto.randomInt(9000)).toString();
}

/**
 * Normalise phone number to E.164 format (ensure leading '+')
 */
function normalizePhone(phoneNumber) {
    return phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
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
 * Generate and send verification code via WhatsApp
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

        // Validate phone number format (must include country code)
        const phoneRegex = /^\+?[1-9]\d{1,14}$/;
        if (!phoneRegex.test(phoneNumber)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid phone number format'
            });
        }

        // Normalise to E.164 format
        const normalizedPhone = normalizePhone(phoneNumber);

        // Rate limiting – prevent sending too many codes
        const existingCode = verificationCodes.get(normalizedPhone);
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

        // Prepare WhatsApp message
        const message = `🍽️ POOH Food\nВаш код подтверждения: *${code}*\nДействителен 5 минут.\n\nรหัสยืนยันของคุณ: *${code}*\nใช้ได้ภายใน 5 นาที`;

        // Send WhatsApp message via Twilio
        await twilioClient.messages.create({
            from: WHATSAPP_FROM,
            to: `whatsapp:${normalizedPhone}`,
            body: message
        });

        // Store verification code
        verificationCodes.set(normalizedPhone, {
            code: code,
            timestamp: Date.now(),
            attempts: 0
        });

        console.log(`✓ WhatsApp verification code sent to ${normalizedPhone}`);

        res.json({
            success: true,
            message: 'Verification code sent via WhatsApp',
            expiresIn: CODE_EXPIRY_MS / 1000 // seconds
        });

    } catch (error) {
        console.error('Error sending WhatsApp verification code:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to send WhatsApp message. Please try again later.'
        });
    }
});

/**
 * POST /api/verify-code
 * Verify the code entered by the user
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

        const normalizedPhone = normalizePhone(phoneNumber);
        const storedData = verificationCodes.get(normalizedPhone);

        if (!storedData) {
            return res.status(404).json({
                success: false,
                error: 'No verification code found. Please request a new code.'
            });
        }

        // Check if code has expired
        if (Date.now() - storedData.timestamp > CODE_EXPIRY_MS) {
            verificationCodes.delete(normalizedPhone);
            return res.status(410).json({
                success: false,
                error: 'Verification code has expired. Please request a new code.'
            });
        }

        // Check max attempts
        if (storedData.attempts >= MAX_ATTEMPTS) {
            verificationCodes.delete(normalizedPhone);
            return res.status(429).json({
                success: false,
                error: 'Maximum verification attempts exceeded. Please request a new code.'
            });
        }

        // Verify code
        if (storedData.code === code) {
            verificationCodes.delete(normalizedPhone);
            console.log(`✓ WhatsApp number verified successfully: ${normalizedPhone}`);

            return res.json({
                success: true,
                message: 'Phone number verified successfully',
                phoneNumber: normalizedPhone
            });
        } else {
            storedData.attempts++;
            verificationCodes.set(normalizedPhone, storedData);

            const attemptsLeft = MAX_ATTEMPTS - storedData.attempts;
            console.log(`✗ Invalid code for ${normalizedPhone}. Attempts left: ${attemptsLeft}`);

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
 * GET /api/status
 * Check server status
 */
app.get('/api/status', (req, res) => {
    res.json({
        success: true,
        status: 'online',
        activeCodes: verificationCodes.size
    });
});

/**
 * GET /
 * Health check endpoint
 */
app.get('/', (req, res) => {
    res.json({
        service: 'POOH Food WhatsApp Server',
        version: '2.0.0',
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
    console.log(`
╔═══════════════════════════════════════════════╗
║     🍽️  POOH Food WhatsApp Server             ║
║     🚀 Server running on port ${PORT}          ║
║     💬 Twilio WhatsApp Gateway Active         ║
╚═══════════════════════════════════════════════╝
    `);

    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
        console.warn('⚠  Warning: TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN not set.');
        console.warn('   Set these in the .env file to enable WhatsApp messaging.');
    } else {
        console.log('✓ Twilio credentials loaded');
    }
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('\nSIGINT received, shutting down gracefully...');
    process.exit(0);
});
