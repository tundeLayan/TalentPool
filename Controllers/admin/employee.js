const sequelize = require('sequelize');
const model = require('../../Models/index');
const render = require('../../Utils/render-page');

const op = sequelize.Op;

const getUser = async function toFindOneFromUser(req, res) {
  const { userId } = req.params;
  const employee = await model.User.findOne({
    where: { userId },
    roleId: 'ROL-EMPLOYEE',
  });
  return employee;
};

const getEmployee = async function toFindOneFromEmployee(req, res) {
  const { userId } = req.params;
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

      const allEmployees = await model.User.findAll({
        where: { roleId: 'ROL-EMPLOYEE' },
        // include: [
        //   {
        //     model: model.Employee,
        //     where: {
        //       userId: { [op.col]: 'User.userId' },
        //     },
        //   },
        // ],
      });

      allEmployees.forEach((data) => {
        if (data.Employee.availability.toLowerCase() === 'not-available') {
          notAvailable.push(data);
        }
        if (data.Employee.availability.toLowerCase() === 'on-site') {
          onSite.push(data);
        }
        if (data.Employee.availability.toLowerCase() === 'remote') {
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
      res.status(500).redirect('back');
    }
  },

  getEmployeeFullDetails: async (req, res) => {
    try {
      const { userId } = req.params;
      const getEmployee = await model.User.findOne({
        where: {
          roleId: 'ROL-EMPLOYEE',
          userId,
        },
        include: [
          {
            model: model.Employee,
            where: {
              userId: { [op.col]: 'User.userId' },
            },
          },
          {
            model: model.Skill,
            where: {
              userId: { [op.col]: 'User.userId' },
            },
          },
          {
            model: model.Portfolio,
            where: {
              userId: { [op.col]: 'User.userId' },
            },
          },
          {
            model: model.Team,
            where: {
              employeeId: { [op.col]: 'User.userId' },
            },
          },
          {
            model: model.Activitylog,
            where: {
              userID: { [op.col]: 'User.userId' },
            },
          },
        ],
      });
      res.status(200).render('pageName', { getEmployee });
    } catch (err) {
      res.status(500).redirect('back');
    }
  },

  blockEmployee: async (req, res) => {
    try {
      const user = await getUser(req, res);
      if (!user) res.status(404).redirect('back');

      user.block = 1;
      await user.save();

      await logActivity(req.session.userId, `Blocked ${user.firstName} ${user.lastName}`);
      res.redirect('/admin/employees?msg=Employee blocked Successfully');
    } catch (err) {
      res.status(500).redirect('back');
    }
  },

  unblockEmployee: async (req, res) => {
    try {
      const user = await getUser(req, res);
      if (!user) res.status(404).redirect('back');

      user.block = 0;
      await user.save();
      await logActivity(req.session.userId, `Unblocked ${user.firstName} ${user.lastName}`);
      res.redirect('/admin/employees?msg=Employee unblocked Successfully');
    } catch (err) {
      res.status(500).redirect('back');
    }
  },

  approveEmployee: async (req, res) => {
    try {
      const employee = await getEmployee(req, res);
      if (!employee) res.status(404).redirect('back');

      employee.verificationStatus = 'Approved';
      await employee.save();
      res.redirect('/admin/employees?msg=Successfully approved Employee');
    } catch (err) {
      res.status(500).redirect('back');
    }
  },

  disapproveEmployee: async (req, res) => {
    try {
      const employee = await getEmployee(req, res);
      if (!employee) res.status(404).redirect('back');

      employee.verificationStatus = 'Disapproved';
      await employee.save();
      res.redirect('/admin/employees?msg=Successfully disapproved Employee');
    } catch (err) {
      res.status(500).redirect('back');
    }
  },
};
