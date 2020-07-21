/* eslint-disable camelcase */
module.exports = (sequelize, DataTypes) => {
  const Company_category = sequelize.define(
    'Company_category',
    {
      id: {
        allowNull: false,
        unique: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      category_id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      category_name: {
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

  Company_category.associate = (model) => {
    Company_category.hasMany(model.Employer);
  };

  return Company_category;
};
