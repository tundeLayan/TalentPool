/* eslint-disable comma-dangle */
module.exports = (sequelize, DataTypes) => {
  const Team = sequelize.define('Team', {
    id: {
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    TeamName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    employeeId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM,
      values: ['Pending', 'Accepted'],
      allowNull: false,
      defaultValue: 'Pending',
    },
  });
  Team.associate = (model) => {
    Team.belongsTo(model.User, { foreignKey: 'userId' });
  };

  return Team;
};
