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
    models.Employee.findAll({
      where: {
        verificationStatus: 'Approved'
      },
    });
  },
  getRecommendedInterns: (models) => {
    return models.Employee.findAll({
      where: {
        userType: 'HNG',
        verificationStatus: 'Approved'
      },
    });
  },
  getPendingHire: (req, models) => {
    models.Team.findAll({
      where: {
        userId: req.session.userId,
        status: 'Pending'
      },
    });
  },
  getTeamMember: (req, models) => {
    models.Team.findAll({
      where: {
        userId: req.session.userId,
        status: 'Accepted'
      },
    });
  }
};
