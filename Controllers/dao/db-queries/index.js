/* eslint-disable no-await-in-loop */
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
  getPortfolio: (models, userId) => {
    return models.Portfolio.findAll({ where: { userId }})
  },
  getEmployee: (models, user) => {
    return models.Employee.findOne({
      where: { userId: user },
    });
  },
  getEmployeeByUserId: (models, user) => {
    return models.Employee.findOne({
      where: { userId: user.userId },
    });
  },
  addSkill: (models, skill) => {
      return models.Skill.create(skill)
  },
  getAllEmployee: (models) => {
    return models.Employee.findAll({
      where: {
        verificationStatus: 'Approved',
      },
      include: [{model: models.User}]
    });
  },
  getSkills: (models, userId) => {
    return models.Skill.findAll({ where: { userId }})
  },
  getRecommendedInterns: (models) => {
    return models.Employee.findAll({
      where: {
        userType: 'HNG',
        verificationStatus: 'Approved',
      },
      include: [{model: models.User}]
    });
  },
  getPendingHire: async (req, models) => {
    const data = [];
    const teamMembers = await models.Team.findAll({
      where: {
        userId: req.session.employerId,
        status: 'Pending',
      },
    });
    for (const singleEmployee of teamMembers) {
      const { firstName, lastName } = await model.User.findOne({
        where: { userId: singleEmployee.dataValues.employeeId },
      });
  
      const { track } = await model.Employee.findOne({
        where: { userId: singleEmployee.dataValues.employeeId },
      });
      data.push({
        track,
        name: `${firstName} ${lastName}`,
      });
    }
    return data;
  },
  getTeamMember: async (req, models) => {
    const data = [];
    const teamMembers = await models.Team.findAll({
      where: {
        userId: req.session.employerId,
        status: 'Accepted',
      },
    });
    for (const singleEmployee of teamMembers) {
      const { firstName, lastName } = await model.User.findOne({
        where: { userId: singleEmployee.dataValues.employeeId },
      });
  
      const { track } = await model.Employee.findOne({
        where: { userId: singleEmployee.dataValues.employeeId },
      });
      data.push({
        track,
        name: `${firstName} ${lastName}`,
      });
    }
    return data;
  },
  getBEinTeam: async (req, models) => {
    const data = [];
    const teamMembers = await models.Team.findAll({
      where: {
        userId: req.session.employerId,
        status: 'Accepted',
      },
    });
    for (const singleEmployee of teamMembers) {
  
      const { track } = await model.Employee.findOne({
        where: { userId: singleEmployee.dataValues.employeeId, track: 'Backend' },
      });
      data.push({
        track,
      });
    }
    return data;
  },
  getFEinTeam: async (req, models) => {
    const data = [];
    const teamMembers = await models.Team.findAll({
      where: {
        userId: req.session.employerId,
        status: 'Accepted',
      },
    });
    for (const singleEmployee of teamMembers) {
  
      const { track } = await model.Employee.findOne({
        where: { userId: singleEmployee.dataValues.employeeId, track: 'Frontend' },
      });
      data.push({
        track,
      });
    }
    return data;
  },
  getDesigninTeam: async (req, models) => {
    const data = [];
    const teamMembers = await models.Team.findAll({
      where: {
        userId: req.session.employerId,
        status: 'Accepted',
      },
    });
    for (const singleEmployee of teamMembers) {
  
      const { track } = await model.Employee.findOne({
        where: { userId: singleEmployee.dataValues.employeeId, track: 'Design' },
      });
      data.push({
        track,
      });
    }
    return data;
  },
  getMobileinTeam: async (req, models) => {
    const data = [];
    const teamMembers = await models.Team.findAll({
      where: {
        userId: req.session.employerId,
        status: 'Accepted',
      },
    });
    for (const singleEmployee of teamMembers) {
  
      const { track } = await model.Employee.findOne({
        where: { userId: singleEmployee.dataValues.employeeId, track: 'Mobile' },
      });
      data.push({
        track,
      });
    }
    return data;
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
  deleteARecord: (models, param) => {
    return models.destroy({
      where: param,
    });
  },
  updateARecord: (models, data, param) => {
    return models.update(data, {
      where: param,
    });
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
      where: { userId },
    });
    return activities;
  },

  allAdmin: async () => {
    const admins = await model.User.findAll({
      where: {
        roleId: 'ROL-ADMIN',
      },
    });
    return admins;
  },

  getAllUploadedEmployers: async () => {
    const  pendingVerifications = await model.Employer.findAll({
      where: {
        verificationStatus: 'Uploaded',
      },
      include:[
        {
          model: model.User,
          where:{
            userId:{ [op.col]: 'Employer.userId' },
          },
        },
      ],
    });
    return pendingVerifications;
  },

  getAllEmployerDocuments: async (userId) => {
    const  employerDocuments = await model.EmployerDocument.findAll({
      where: {
        userId,
      },
    });
    return employerDocuments;
  },

  getFullEmployerProfileByUserId: async (userId) =>{
    const fullEmployerProfile = await model.Employer.findOne({
      where:{
        userId,
      },
      include:[
        {
          model: model.User,
          where:{
            userId: { [op.col]: 'Employer.userId' },
          },
        },
      ],
    });
    return fullEmployerProfile;
  },

  getEmployeeTeamDetail: async (models, employeeId) => {
    return models.Team.findOne({ where: { employeeId }})
  },

  getUserById: async (models, userId) => {
    return models.User.findOne({ where: { userId }})
  }
};
