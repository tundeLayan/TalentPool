const express = require('express');
const { demoTwo, demoTwoId } = require('../../Controllers/demo-two');

const router = express.Router();

router.get('/', demoTwo)
router.get('/:id', demoTwoId);

module.exports = router;
