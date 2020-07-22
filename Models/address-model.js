module.exports = (sequelize, DataTypes) => {
  const Address = sequelize.define('Address', {
    id: {
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    phoneNumberOne: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumberTwo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING(100),
      defaultValue: null,
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING(100),
      defaultValue: null,
    },
    postalCode: {
      type: DataTypes.STRING(200),
      defaultValue: null,
    },
    landmark: {
      type: DataTypes.STRING,
      defaultValue: null,
      allowNull: true,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  Address.associate = (model) => {
    Address.belongsTo(model.User, { foreignKey: 'userId' });
  };

  return Address;
};
