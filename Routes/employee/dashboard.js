const express = require('express');
const { addSkills, viewSkills, deleteSkill, availableEmployers, numberOfViews } = require('../../Controllers/employee/dashboard');

const router = express.Router();

router.get('/', numberOfViews)
router.get('/available/employers', availableEmployers)
router.get('/skills', viewSkills);
router.post('/skills', addSkills)
router.delete('/', deleteSkill)

module.exports = router;