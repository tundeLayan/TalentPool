/* eslint-disable comma-dangle */
module.exports = (sequelize, DataTypes) => {
  const Subscription = sequelize.define('Subscription', {
    id: {
      allowNull: false,
      unique: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    subscriptionId: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    packageId: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  });
  return Subscription;
};
