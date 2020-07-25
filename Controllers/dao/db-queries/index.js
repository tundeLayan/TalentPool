const model = require('../../../Models/index');

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
};
