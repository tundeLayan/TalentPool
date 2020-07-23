const express = require('express');
const demoTwo = require('./demo-two');
const demoThree = require('./demo-three');
const employeeSkills = require('./employee-skills');

const router = express.Router();
router.use('/profile', demoTwo);
router.use('/another', demoThree);
router.use('/skills', employeeSkills)

module.exports = router;
