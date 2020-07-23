const express = require('express');
const { addSkills, viewSkills, deleteSkill } = require('../../Controllers/employee/employee-skills');

const router = express.Router();

router.get('/', viewSkills);
router.post('/', addSkills)
router.delete('/', deleteSkill)

module.exports = router;