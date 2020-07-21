/* eslint-disable comma-dangle */
module.exports = (sequelize, DataTypes) => {
  const Employer = sequelize.define(
    'Employer',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      companyCategoryId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      employerType: {
        type: DataTypes.ENUM,
        values: ['Individual', 'Company'],
        allowNull: false,
        defaultValue: 'Individual',
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      sex: {
        type: DataTypes.ENUM,
        values: ['Male', 'Female', 'Organization'],
        allowNull: false,
        defaultValue: 'Organization',
      },

      verificationStatus: {
        type: DataTypes.ENUM,
        values: ['Approved', 'Disapproved', 'Pending', 'Uploaded'],
        allowNull: false,
        defaultValue: 'Pending',
      },
      employerPhone: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      employerEmail: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      employerAddress: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      employerCountry: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      employerPhoto: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      website: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      facebook: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      twitter: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      linkedin: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      instagram: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      hearAboutUs: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      teamName: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      packageStatus: {
        type: DataTypes.ENUM,
        values: ['Running', 'Expired'],
        defaultValue: 'Expired',
      },
      userId: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    }
  );
  Employer.associate = (model) => {
    Employer.belongsTo(model.User, { foreignKey: 'userId' });
  };
  return Employer;
};
