module.exports = (sequelize, DataTypes) => {
  const Employerdocument = sequelize.define('Employerdocument', {
    id: {
      allowNull: false,
      unique: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    documenId: {
      type: DataTypes.STRING(255),
      primaryKey: true,
      allowNull: false,
    },
    documentName: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 0,
    },
    documentNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fileLink: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Employerdocument.associate = (model) => {
    Employerdocument.belongsTo(model.User, {
      foreignKey: 'UserId',
    });
  };

  return Employerdocument;
};
