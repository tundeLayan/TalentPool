const crypto = require('crypto');

/**
 * Create a random key that can be used for signing tokens
 * @param keyLength - the required byte of key to be generated
 * @returns {string} - the key returned form the function
 */
exports.key = (keyLength) => crypto.randomBytes(keyLength).toString('hex');
