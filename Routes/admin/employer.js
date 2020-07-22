const express = require('express');
const {
  allEmployers,
  approveEmployer,
  disapproveEmployer,
  blockEmployer,
  unblockEmployer,
} = require('../../Controllers/admin/employer');

const router = express.Router();

router
  .route('/all/employers')
  .patch(allEmployers);
router
  .route('/block/employer/:userId')
  .patch(blockEmployer);
router
  .route('/unblock/employer/:userId')
  .patch(unblockEmployer);
router
  .route('/approve/employee/:userId')
  .patch(approveEmployer);
router
  .route('/disapprove/employee/:userId')
  .patch(disapproveEmployer);
