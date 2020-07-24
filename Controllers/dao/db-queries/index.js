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
  employerChatUsers: async () => {
    const users = await model.Employer.findAll({
        raw: true,
        attributes: ['userId', 'employerPhoto'],
        include: [{
            model: model.User,
            attributes: ['roleId'],
        },],
    })

    return users
},

employeeChatUsers: async () => {
    const users = model.Employee.findAll({
        raw: true,
        attributes: ['userId', 'image'],
        include: [{
            model: model.User,
            attributes: ['roleId'],
        },],
    })

    return users
},
  createUser: (models, data) => {
    return models.User.create(data);
  }
};
