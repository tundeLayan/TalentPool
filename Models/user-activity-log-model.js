module.exports = (sequelize, DataTypes) => {
  const Activitylog = sequelize.define('Activitylog', {
    id: {
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      foreignKey: true,
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  Activitylog.associate = (model) => {
    Activitylog.belongsTo(model.User, { foreignKey: 'userId' });
  };

  return Activitylog;
};
