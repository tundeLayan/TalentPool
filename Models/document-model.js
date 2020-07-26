module.exports = (sequelize, DataTypes) => {
  const EmployerDocument = sequelize.define('EmployerDocument', {
    id: {
      allowNull: false,
      unique: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    documentId: {
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
    status: {
      type: DataTypes.ENUM,
      values: ['Approved', 'Disapproved', 'Pending'],
      defaultValue: 'Pending',
    },
    comment: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fileLink: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  EmployerDocument.associate = (model) => {
    EmployerDocument.belongsTo(model.User, {
      foreignKey: 'userId',
    });
  };

  return EmployerDocument;
};
