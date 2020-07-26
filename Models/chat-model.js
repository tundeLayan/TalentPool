module.exports = (sequelize, DataTypes) => {
  const Chat = sequelize.define(
    'Chat',
    {
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
      readStatus: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      receiverId: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      paranoid: true,
      underscored: true,
    },
  );
  Chat.associate = (model) => {
    Chat.belongsTo(model.User, { foreignKey: 'userId' });
  };

  return Chat;
};
