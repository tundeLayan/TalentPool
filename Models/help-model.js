module.exports = (sequelize, DataTypes) => {
  const Help = sequelize.define('Help', {
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
    replyIdUserId: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM,
      values: ['open', 'closed', 'escalate'],
      defaultValue: 'open',
    },
    userId: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  });
  Help.associate = (model) => {
    Help.belongsTo(model.User, { foreignKey: 'userId' });
  };

  return Help;
};
