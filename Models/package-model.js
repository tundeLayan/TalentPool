module.exports = (sequelize, DataTypes) => {
  const Package = sequelize.define('Package', {
    packageName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    packageType: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    packageId: {
      type: DataTypes.STRING(100),
      primaryKey: true,
      allowNull: false,
    },
  });

  Package.associate = (model) => {
    Package.belongsToMany(model.User, {
      through: 'Subscription',
      foreignKey: 'packageId',
    });
  };

  return Package;
};
