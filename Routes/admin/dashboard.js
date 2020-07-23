const express = require('express');
const {
  dashboard,
} = require('../../Controllers/admin/dashboard');

const router = express.Router();

router
  .route('/admin/dashboard')
  .get(dashboard);
