/* eslint-disable comma-dangle */
module.exports = (sequelize, DataTypes) => {
  const Skill = sequelize.define('Skill', {
    id: {
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    skillDescription: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  Skill.associate = (model) => {
    Skill.belongsTo(model.User, { foreignKey: 'userId' });
  };

  return Skill;
};
