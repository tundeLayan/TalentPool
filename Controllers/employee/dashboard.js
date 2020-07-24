const model = require('../../Models');


const numberOfViews = async (req, res) => {
  try{
    const employee = await model.Employee.findOne({
      where: {
        userId: 'a52867c3-000c-4102-bbc2-10b1a9041e62'
      }
    })
    res.render('employee/employeeDashboard', {employee, title: 'Employee Dashboard'})
  } catch(err){
    const error = err;
    const { message } = err;
    res.render('error', {message, error})
  }
}

const availableEmployers = async (req, res) => {
  try {
    const employer = await model.User.findAll({
      where: {
        roleId: 'ROL-EMPLOYER',
      },
    });
    res.render('employee/employeeDashboard', {
      employer,
      title: 'Employer Dashboard',
    });
  } catch (err) {
    const error = err;
    const { message } = err;
    res.render('error', { message, error });
  }
};

const viewSkills = async (req, res) => {
  try {
    const skills = await model.Skill.findAll({
      where: {
        userId: res.session.userId,
      },
    });
    res.render('employee/employeeDashboard', {
      skills,
      title: 'Employee Dashboard',
    });
  } catch (err) {
    const error = err;
    const { message } = err;
    res.render('error', { message, error });
  }
};

const addSkills = async (req, res) => {
  try {
    const { skillDescription } = req.body;
    const skills = await model.Skill.create(skillDescription);
    res.render('employee/employeeDashboard', {
      skills,
      title: 'Employee Dashboard',
    });
  } catch (err) {
    const error = err;
    const { message } = err;
    res.render('error', { message, error });
  }
};

const deleteSkill = async (req, res) => {
  try {
    const { skillDescription } = req.body;
    await model.Skill.destroy({
      where: {
        skillDescription,
      },
      force: true,
    });
    res.render('employee/employeeDashboard', {
      title: 'Employee Dashboard',
    });
  } catch (err) {
    const error = err;
    const { message } = err;
    res.render('error', { message, error });
  }
};

module.exports = {
  addSkills,
  viewSkills,
  deleteSkill,
  availableEmployers,
  numberOfViews
};
