/**
 * Cudy LT500 4G LTE Router API Client
 * Handles authentication and SMS sending through OpenWRT/LuCI interface
 */

const fetch = require('node-fetch');
const { CookieJar } = require('tough-cookie');
const fetchCookie = require('fetch-cookie');

class CudyLT500_API {
    constructor(routerIp, username, password, protocol = 'http') {
        this.routerIp = routerIp;
        this.username = username;
        this.password = password;
        this.protocol = protocol;
        this.baseUrl = `${protocol}://${routerIp}`;
        this.cookieJar = new CookieJar();
        this.fetch = fetchCookie(fetch, this.cookieJar);
        this.isAuthenticated = false;
        this.sysauthCookie = null;
        
        console.log(`📡 Router API initialized: ${this.baseUrl}`);
    }

    /**
     * Login to the router using OpenWRT/LuCI API
     * @returns {Promise<boolean>} Authentication status
     */
    async login() {
        try {
            const loginUrl = `${this.baseUrl}/cgi-bin/luci`;
            
            // Prepare form data for authentication
            const formData = new URLSearchParams();
            formData.append('luci_username', this.username);
            formData.append('luci_password', this.password);

            const response = await this.fetch(loginUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Referer': `${this.baseUrl}/cgi-bin/luci`
                },
                body: formData.toString(),
                redirect: 'manual' // Don't follow redirects automatically
            });

            // Check if authentication was successful
            // LuCI typically sets a sysauth cookie on successful login
            const cookies = await this.cookieJar.getCookies(loginUrl);
            const sysauthCookie = cookies.find(cookie => cookie.key === 'sysauth');

            if (sysauthCookie) {
                this.sysauthCookie = sysauthCookie.value;
                this.isAuthenticated = true;
                console.log('✓ Successfully authenticated with Cudy LT500 router');
                return true;
            }

            // If no cookie but got redirect (302), might still be authenticated
            if (response.status === 302) {
                const cookies = await this.cookieJar.getCookies(loginUrl);
                const sysauthCookie = cookies.find(cookie => cookie.key === 'sysauth');
                if (sysauthCookie) {
                    this.sysauthCookie = sysauthCookie.value;
                    this.isAuthenticated = true;
                    console.log('✓ Successfully authenticated with Cudy LT500 router (via redirect)');
                    return true;
                }
            }

            console.error('✗ Authentication failed - no sysauth cookie received');
            return false;
        } catch (error) {
            console.error('✗ Login error:', error.message);
            this.isAuthenticated = false;
            return false;
        }
    }

    /**
     * Send SMS through the router
     * @param {string} phoneNumber - Recipient phone number (e.g., +972501234567)
     * @param {string} message - SMS message text
     * @param {boolean} isRetry - Internal flag to prevent infinite recursion
     * @returns {Promise<boolean>} Success status
     */
    async sendSMS(phoneNumber, message, isRetry = false) {
        if (!this.isAuthenticated) {
            console.log('Not authenticated, attempting login...');
            const loginSuccess = await this.login();
            if (!loginSuccess) {
                throw new Error('Failed to authenticate with router');
            }
        }

        try {
            const smsUrl = `${this.baseUrl}/cgi-bin/luci/admin/network/gcom/sms`;
            
            // Prepare SMS form data according to Cudy LT500 API
            const formData = new URLSearchParams();
            formData.append('iface', '4g');
            formData.append('smssend.number', phoneNumber);
            formData.append('smssend.text', message);

            const response = await this.fetch(smsUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Referer': `${this.baseUrl}/cgi-bin/luci/admin/network/gcom/sms`
                },
                body: formData.toString()
            });

            if (response.ok) {
                console.log(`✓ SMS sent successfully to ${phoneNumber}`);
                return true;
            } else {
                const responseText = await response.text();
                console.error(`✗ Failed to send SMS: ${response.status} - ${responseText}`);
                
                // If unauthorized, try to re-authenticate (only once to prevent infinite loop)
                if ((response.status === 401 || response.status === 403) && !isRetry) {
                    console.log('Session expired, re-authenticating...');
                    this.isAuthenticated = false;
                    const loginSuccess = await this.login();
                    if (loginSuccess) {
                        // Retry SMS send after re-authentication (with isRetry flag)
                        return this.sendSMS(phoneNumber, message, true);
                    }
                }
                return false;
            }
        } catch (error) {
            console.error('✗ SMS sending error:', error.message);
            return false;
        }
    }

    /**
     * Check router connectivity
     * @returns {Promise<boolean>} Connection status
     */
    async checkConnection() {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            
            const fetchOptions = {
                method: 'GET',
                signal: controller.signal
            };
            
            // Disable SSL verification for self-signed certificates if HTTPS
            if (this.protocol === 'https') {
                const https = require('https');
                fetchOptions.agent = new https.Agent({ rejectUnauthorized: false });
            }
            
            const response = await fetch(`${this.baseUrl}/cgi-bin/luci`, fetchOptions);
            
            clearTimeout(timeoutId);
            return response.ok || response.status === 401; // 401 means router is reachable but needs auth
        } catch (error) {
            console.error(`✗ Router connection check failed: ${error.message}`);
            if (error.name === 'AbortError') {
                console.error(`  Connection timeout. Check if router is accessible at: ${this.baseUrl}/cgi-bin/luci`);
            }
            return false;
        }
    }

    /**
     * Logout from the router
     */
    async logout() {
        if (!this.isAuthenticated) return;
        
        try {
            await this.fetch(`${this.baseUrl}/cgi-bin/luci/admin/logout`, {
                method: 'GET',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
            this.isAuthenticated = false;
            this.sysauthCookie = null;
            console.log('✓ Logged out from router');
        } catch (error) {
            console.error('✗ Logout error:', error.message);
        }
    }
}

module.exports = CudyLT500_API;
