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
  .route('/all/employers')
  .get(allEmployers);
router
  .route('/employer/:userId')
  .get(getEmployerProfile);
router
  .route('/block/employer/:userId')
  .patch(blockEmployer);
router
  .route('/unblock/employer/:userId')
  .patch(unblockEmployer);
router
  .route('/approve/employer/:userId')
  .patch(approveEmployer);
router
  .route('/disapprove/employer/:userId')
  .patch(disapproveEmployer);

module.exports = router;