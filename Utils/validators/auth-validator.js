const { body } = require('express-validator');

const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email address.')
    .normalizeEmail(),
  body('password', 'Password has to be valid.')
    .isLength({ min: 8 })
    .trim(),
];

module.exports.validateLogin = validateLogin;