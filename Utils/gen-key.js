const crypto = require('crypto');

exports.key = (keyLength) => crypto.randomBytes(keyLength).toString('hex');
