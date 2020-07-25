const sequelize = require('sequelize');
const model = require('../../../Models/index');

const op = sequelize.Op;

module.exports = {
  getUserByEmail: (models, email) => {
    return models.User.findOne({ where: { email } });
  },
  getEmployer: (models, user) => {
    return models.Employer.findOne({
      where: { userId: user.userId },
    });
  },
  getEmployee: (models, user) => {
    return models.Employee.findOne({
      where: { userId: user.userId },
    });
  },
  getAllEmployee: (models) => {
    return models.Employee.findAll({
      where: {
        verificationStatus: 'Approved',
      },
    });
  },
  getRecommendedInterns: (models) => {
    return models.Employee.findAll({
      where: {
        userType: 'HNG',
        verificationStatus: 'Approved',
      },
    });
  },
  getPendingHire: (req, models) => {
    return models.Team.findAll({
      where: {
        // userId: req.session.userId,
        status: 'Pending',
      },
    });
  },
  getTeamMember: (req, models) => {
    return models.Team.findAll({
      where: {
        // userId: req.session.userId,
        status: 'Accepted',
      },
    });
  },
  employerChatUsers: async () => {
    const users = await model.Employer.findAll({
      raw: true,
      attributes: ['userId', 'employerPhoto'],
      include: [
        {
          model: model.User,
          attributes: ['roleId'],
        },
      ],
    });

    return users;
  },

  employeeChatUsers: async () => {
    const users = model.Employee.findAll({
      raw: true,
      attributes: ['userId', 'image'],
      include: [
        {
          model: model.User,
          attributes: ['roleId'],
        },
      ],
    });

    return users;
  },
  createUser: (models, data) => {
    return models.User.create(data);
  },

  getAllApprovedEmployers: async () => {
    const approvedEmployers = await model.Employer.findAll({
      where: { verificationStatus: 'Approved' },
    });
    return approvedEmployers;
  },

  getAllApprovedEmployees: async () => {
    const approvedEmployees = await model.Employee.findAll({
      where: { verificationStatus: 'Approved' },
    });
    return approvedEmployees;
  },

  getAllDisapprovedEmployers: async () => {
    const disapprovedEmployers = await model.Employer.findAll({
      where: { verificationStatus: 'Disapproved' },
    });
    return disapprovedEmployers;
  },

  getAllDisapprovedEmployees: async () => {
    const disapprovedEmployees = await model.Employee.findAll({
      where: { verificationStatus: 'Disapproved' },
    });
    return disapprovedEmployees;
  },

  getAllUsers: async () => {
    const allUsers = await model.User.findAll({});
    return allUsers;
  },

  getAllEmployers: async () => {
    const allEmployers = await model.Employer.findAll({});
    return allEmployers;
  },

  getPendingEmployees: async () => {
    const pendingEmployees = await model.Employee.findAll({
      where: {
        verificationStatus: 'Pending',
      },
    });
    return pendingEmployees.length;
  },

  getLatestEmployers: async () => {
    const latestEmployers = await model.Employer.findAll({
      include: [
        {
          model: model.User,
          where: {
            userId: { [op.col]: 'Employer.userId' },
          },
        },
      ],
      limit: 10,
      order: [['id', 'DESC']],
    });
    return latestEmployers;
  },

  getAllSubscriptions: async () => {
    const allSubscriptions = await model.Subscription.findAll({
      order: [['id', 'DESC']],
    });
    return allSubscriptions;
  },

  getAdmin: async (userId) => {
    const admin = await model.User.findOne({
      where: { userId },
      roleId: 'ROL-ADMIN',
    });
    return admin;
  },
  activityLog: async (userId) => {
    const activities = await model.Activitylog.findAll({ 
      where: { userId } 
    });
    return activities;
  },

  allAdmin: async () => {
    const admins = await model.User.findAll({ 
      where: { 
        roleId: 'ROL-ADMIN' 
      } 
    });
    return admins;
  }
};
