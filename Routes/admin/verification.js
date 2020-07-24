const express = require('express');
const {
  verification,
} = require('../../Controllers/admin/verification');

const router = express.Router();

router
  .route('/verification')
  .get(verification);

module.exports = router;