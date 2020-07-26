module.exports = (sequelize, DataTypes) => {
  const CompanyCategory = sequelize.define(
    'CompanyCategory',
    {
      id: {
        allowNull: false,
        unique: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      categoryId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      categoryName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      underscored: true,
    },
  );
  CompanyCategory.associate = (model) => {
    CompanyCategory.hasMany(model.Employer, {
      onDelete: 'cascade',
    });
  };

  return CompanyCategory;
};
