const express = require('express');
const {addSkills, viewSkills, deleteSkill, numberOfViews, availableEmployers} = require('../../Controllers/employee/dashboard');

const router = express.Router();

router.get('/', numberOfViews)
router.get('/skills', viewSkills)
router.get('/', availableEmployers);
router.post('/skills/add', addSkills)
router.delete('/skill/delete', deleteSkill)

module.exports = router;