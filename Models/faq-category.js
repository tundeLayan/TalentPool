module.exports = (sequelize,DataTypes) => {
    const FaqCategory = sequelize.define(
        'FaqCategory', {
            id:{
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
                type: DataTypes.INTEGER
            },
            name: {
                allowNull: false,
                type: DataTypes.STRING
            },
        }
    );
    FaqCategory.associate = (model) => {
        FaqCategory.hasMany(model.Faq,{
            onDelete: 'cascade',
        })
    };
    return FaqCategory;
}