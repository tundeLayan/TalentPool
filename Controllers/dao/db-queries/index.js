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
};
