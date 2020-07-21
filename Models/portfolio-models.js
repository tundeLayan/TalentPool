/* eslint-disable comma-dangle */
module.exports = (sequelize, DataTypes) => {
  const Portfolio = sequelize.define('Portfolio', {
    id: {
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    link: {
      type: DataTypes.STRING(255),
      defaultValue: null,
      allowNull: true,
    },
    userId: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  });
  Portfolio.associate = (model) => {
    Portfolio.belongsTo(model.User, { foreignKey: 'userId' });
  };
  return Portfolio;
};
