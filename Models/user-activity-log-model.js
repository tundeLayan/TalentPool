/* eslint-disable comma-dangle */
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
  });
  // eslint-disable-next-line no-unused-vars
  // User.associate = function(models)
  // associations can be defined here
  //   };

  Activitylog.associate = (model) => {
    Activitylog.belongsTo(model.User, { foreignKey: 'userId' });
  };

  return Activitylog;
};
