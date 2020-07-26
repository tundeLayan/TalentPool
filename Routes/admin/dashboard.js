const express = require('express');
const {
  dashboard,
} = require('../../Controllers/admin/dashboard');

const router = express.Router();

router
  .route('/')
  .get(dashboard);

module.exports = router;
