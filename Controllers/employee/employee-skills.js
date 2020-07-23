const { renderPage } = require('../../Utils/render-page');
const model = require('../../Models');

const viewSkills = async (req, res) => {
  try {
    const data = await model.Skill.findAll({
      where: {
        userId: req.body.userId,
      },
    });
    const result = data;
    renderPage(res, 'employee/employeeDashboard', result, 'Employee Dashboard');
  } catch (err) {
    console.log(err);
  }
};

const addSkills = async (req, res) => {
  try {
    const skill = req.body;
    const data = await model.Skill.create(skill);
    const result = data;
    renderPage(res, 'employee/employeeDashboard', result, 'Employee Dashboard');
  } catch (err) {
    console.log(err);
  }
};

const deleteSkill = async (req, res) => {
  try {
    const { id, userId } = req.body;
    const query = await model.Skill.destroy({
      where: {
        id,
        userId,
      },
      force: true
    });
    const data = await query;
    renderPage(res, 'employee/employeeDashboard', data, 'Employee Dashboard')
  } catch (err) {
      console.log(err)
  }
};

module.exports = {
  addSkills,
  viewSkills,
  deleteSkill
};
