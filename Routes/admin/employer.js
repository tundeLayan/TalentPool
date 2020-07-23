const express = require('express');
const {
  allEmployers,
  getEmployerProfile,
  blockEmployer,
  unblockEmployer,
  approveEmployer,
  disapproveEmployer,
} = require('../../Controllers/admin/employer');

const router = express.Router();

router
  .route('/admin/all/employers')
  .get(allEmployers);
router
  .route('/admin/employer/profile/:userId')
  .get(getEmployerProfile);
router
  .route('/admin/block/employer/:userId')
  .patch(blockEmployer);
router
  .route('/admin/unblock/employer/:userId')
  .patch(unblockEmployer);
router
  .route('/admin/approve/employer/:userId')
  .patch(approveEmployer);
router
  .route('/admin/disapprove/employer/:userId')
  .patch(disapproveEmployer);
