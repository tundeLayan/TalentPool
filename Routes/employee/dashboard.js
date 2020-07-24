const express = require('express');
const {addSkills, viewSkills, deleteSkill, numberOfViews, availableEmployers} = require('../../Controllers/employee/dashboard');

const router = express.Router();

router.get('/', numberOfViews)
router.get('/', viewSkills)
router.get('/', availableEmployers);
router.post('/', addSkills)
router.delete('/', deleteSkill)

module.exports = router;