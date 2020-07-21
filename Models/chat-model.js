/* eslint-disable comma-dangle */
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
      read_status: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      receiver_id: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      user_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      paranoid: true,
      underscored: true,
      // timestamp:false,
    }
  );
  // eslint-disable-next-line no-unused-vars
  // User.associate = function(models)
  // associations can be defined here
  //   };
  Chat.associate = (model) => {
    Chat.belongsTo(model.User, { foreignKey: 'user_id' });
  };

  return Chat;
};
