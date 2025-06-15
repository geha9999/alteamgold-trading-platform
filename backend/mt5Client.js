const axios = require('axios');

/**
 * MT5 Client for interacting with MetaTrader 5 API
 * Replace baseURL with your MT5 server API endpoint
 */

const mt5Api = axios.create({
  baseURL: process.env.MT5_API_BASE_URL || 'https://your-mt5-server-api.com',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Validate MT5 account credentials
 * @param {string} brokerName
 * @param {string} serverName
 * @param {string} accountId
 * @param {string} passcode
 * @returns {Promise<boolean>}
 */
async function validateAccount(brokerName, serverName, accountId, passcode) {
  try {
    const response = await mt5Api.post('/validate-account', {
      brokerName,
      serverName,
      accountId,
      passcode,
    });
    return response.data.valid;
  } catch (error) {
    console.error('MT5 account validation error:', error);
    throw new Error('Failed to validate MT5 account');
  }
}

module.exports = {
  validateAccount,
};
