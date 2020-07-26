const express = require('express');
const {
  verification, getEmployerDocument,
} = require('../../Controllers/admin/verification');

const router = express.Router();

router
  .route('/')
  .get(verification);

router
  .route('/employer/documents/:userId')
  .get(getEmployerDocument);

module.exports = router;