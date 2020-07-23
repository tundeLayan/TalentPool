module.exports = (sequelize, DataTypes) => {
  const Faq = sequelize.define(
    'Faq',
    {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      question: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      answer: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      blocked: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      indexes: [
        {
          type: 'FULLTEXT',
          name: 'question',
          fields: ['question', 'answer'],
        },
      ],
    },
  );
  Faq.associate = (model) => {
    Faq.belongsTo(model.User, { foreignKey: 'userId' });
    Faq.belongsTo(model.FaqCategory, {foreignKey: 'FaqCategoryId'})
  };


  return Faq;
};
