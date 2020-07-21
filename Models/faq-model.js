/* eslint-disable comma-dangle */
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
      category: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: 'TP',
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
        // {
        //   type: 'FULLTEXT',
        //   name: 'answer',
        //   fields :['answer']
        // }
      ],
      // timestamp:false,
    },
  );
  // eslint-disable-next-line no-unused-vars
  // User.associate = function(models)
  // associations can be defined here
  //   };
  Faq.associate = (model) => {
    Faq.belongsTo(model.User, { foreignKey: 'userId' });
  };

  return Faq;
};
