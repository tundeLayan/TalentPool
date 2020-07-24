const { body } = require('express-validator');

const validateSignup = [
  body('firstName', 'Firstname cannot be empty').notEmpty(),
  body('lastName', 'Lastname cannot be empty').notEmpty(),
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage(
      'Password should contain a minimum of 8 characters (upper and lowercase letters, numbers and at least one special character)',
    )
    .matches(
      
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!_`,/@#\-"=:;~<>'\\$%\\^&\\*\\?|\\+\\(\\)\\[\]\\{}\\.])(?=.{8,})/,
    )
    .withMessage(
      'Password should contain a minimum of 8 characters (upper and lowercase letters, numbers and at least one special character)',
    ),
];

const validateEmail = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
];

module.exports = {
  validateSignup,
  validateEmail,
};
