const express = require('express');
const { demoThree, demoThreeId } = require('../../Controllers/employee/demo-three');

const router = express.Router();

router.get('/', demoThree)
router.get('/:id', demoThreeId);

module.exports = router;
