module.exports = (sequelize, DataTypes) => {
  const Employee = sequelize.define('Employee', {
    id: {
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    userType: {
      type: DataTypes.ENUM,
      values: ['HNG', 'NON-HNG'],
      allowNull: false,
      defaultValue: 'NON-HNG',
    },
    verificationStatus: {
      type: DataTypes.ENUM,
      values: ['Approved', 'Disapproved', 'Pending'],
      allowNull: false,
      defaultValue: 'Pending',
    },
    phoneNumber: {
      type: DataTypes.STRING(250),
      allowNull: false,
      unique: true,
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    gender: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    hngId: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    dateOfBirth: {
      type: DataTypes.STRING(255),
      defaultValue: null,
    },
    availability: {
      type: DataTypes.ENUM,
      values: ['On-site', 'Remote', 'Not-Available'],
      allowNull: false,
    },
    userName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    employeeCv: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    views: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    track: {
      type: DataTypes.ENUM,
      values: ['Frontend', 'Backend', 'Design', 'Mobile'],
      allowNull: false,
    },
    userId: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    referredBy: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    hasTeam: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  });
  Employee.associate = (model) => {
    Employee.belongsTo(model.User, { foreignKey: 'userId' });
  };

  return Employee;
};
