const sequelize = require('sequelize');
const model = require('../../Models/index');
const render = require('../../Utils/render-page');

const op = sequelize.Op;

const getUser = async function toFindOneFromUser(userId) {
  const employee = await model.User.findOne({
    where: { userId },
    roleId: 'ROL-EMPLOYEE',
  });
  return employee;
};

const getEmployee = async function toFindOneFromEmployee(userId) {
  const employee = await model.Employee.findOne({
    where: { userId },
  });
  return employee;
};

const logActivity = async function toLogAdminActivities(adminId, message) {
  const log = await model.Activitylog.create({
    message: message,
    userId: adminId,
    ipAddress: '192.168.33.10'
  })
  return log;
}

module.exports = {
  getAllEmployees: async (req, res) => {
    try {
      const onSite = [];
      const remote = [];
      const notAvailable = [];

      const allEmployees = await model.Employee.findAll({
        include: [
          {
            model: model.User,
            where: {
              userId: { [op.col]: 'Employee.userId' },
            },
          },
        ],
      });

      allEmployees.forEach((data) => {
        if (data.availability.toLowerCase() === 'not-available') {
          notAvailable.push(data);
        }
        if (data.availability.toLowerCase() === 'on-site') {
          onSite.push(data);
        }
        if (data.availability.toLowerCase() === 'remote') {
          remote.push(data);
        }
      });

      const data = {
        allEmployees,
        onSiteEmployees: onSite.length,
        remoteEmmployees: remote.length,
        notAvailableEmployees: notAvailable.length,
      }
      res.status(200).json({
        data
      })
      // renderPage(res, 'pageName', data, 'Demo Page')
    } catch (err) {
      console.log(err);
      // res.status(500).redirect('back');
    }
  },

  getEmployeeFullDetails: async (req, res) => {
    try {
      const { userId } = req.params;
      const getEmployee = await model.Employee.findOne({
        where: { userId },
        include: [
          {
            model: model.User,
            where: {
              userId: { [op.col]: 'Employee.userId' },
            },
          },
        ],
      });
      const getEmployeeSkills = await model.Skill.findAll({ where: { userId } })
      const getEmployeeTeam = await model.Team.findAll({ where: { employeeId: userId} })
      const getEmployeeActivity = await model.Activitylog.findAll({ where: { userId } })
      const getEmployeePortfolio = await model.Portfolio.findAll({ where: { userId } })

      const data = {
        getEmployee,
        getEmployeeSkills,
        getEmployeeTeam,
        getEmployeeActivity,
        getEmployeePortfolio,
      }
      res.status(200).json({
        data
      });
       // renderPage(res, 'pageName', data, 'Demo Page')
    } catch (err) {
      res.status(500).redirect('back');
    }
  },

  blockEmployee: async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await getUser(userId);
      if (!user) res.status(404).redirect('back');

      user.block = 1;
      await user.save();

      await logActivity('9f8e004f-e847-4c2b-8a04-458689acb043', `Blocked ${user.firstName} ${user.lastName}`);
      res.status(200).json({
        message: "success"
      });
      // res.redirect('/admin/employees?msg=Employee blocked Successfully');
    } catch (err) {
      res.status(500).redirect('back');
    }
  },

  unblockEmployee: async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await getUser(userId);
      if (!user) res.status(404).redirect('back');

      user.block = 0;
      await user.save();
      await logActivity('9f8e004f-e847-4c2b-8a04-458689acb043', `Unblocked ${user.firstName} ${user.lastName}`);

      res.status(200).json({
        message: "success"
      });
      // res.redirect('/admin/employees?msg=Employee unblocked Successfully');
    } catch (err) {
      res.status(500).redirect('back');
    }
  },

  approveEmployee: async (req, res) => {
    try {
      const { userId } = req.params;
      const employee = await getEmployee(userId);
      if (!employee) res.status(404).redirect('back');

      employee.verificationStatus = 'Approved';
      await employee.save();

      res.status(200).json({
        message: "success"
      });

      await logActivity('9f8e004f-e847-4c2b-8a04-458689acb043', `Approved ${employee.userName}`);
      // res.redirect('/admin/employees?msg=Successfully approved Employee');
    } catch (err) {
      res.status(500).redirect('back');
    }
  },

  disapproveEmployee: async (req, res) => {
    try {
      const { userId } = req.params;
      const employee = await getEmployee(userId);
      if (!employee) res.status(404).redirect('back');

      employee.verificationStatus = 'Disapproved';
      await employee.save();

      await logActivity('9f8e004f-e847-4c2b-8a04-458689acb043', `Disapproved ${employee.userName}`);
      res.status(200).json({
        message: "success"
      });
      // res.redirect('/admin/employees?msg=Successfully disapproved Employee');
    } catch (err) {
      res.status(500).redirect('back');
    }
  },
};
