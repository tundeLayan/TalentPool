module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define('Review', {
    id: {
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    rating: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reviewId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  });
  Review.associate = (model) => {
    Review.belongsTo(model.User, { foreignKey: 'userId' });
  };

  return Review;
};
