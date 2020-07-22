module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      allowNull: false,
      autoIncrement: true,
      unique: true,
      type: DataTypes.INTEGER,
    },
    firstName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM,
      values: ['0', '1'],
      allowNull: false,
      defaultValue: '0',
    },
    block: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    provider: {
      type: DataTypes.STRING(255),
      defaultValue: null,
    },
    email: {
      type: DataTypes.STRING(250),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(250),
      allowNull: false,
    },
    googleId: {
      type: DataTypes.STRING(250),
      allowNull: true,
      unique: true,
    },
    githubId: {
      type: DataTypes.STRING(250),
      allowNull: true,
      unique: true,
    },
    emailVerifiedAt: {
      type: 'TIMESTAMP',
      allowNull: true,
    },
    roleId: {
      type: DataTypes.STRING,
    },
    userId: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    loginNotif: {
      type: DataTypes.ENUM,
      values: ['0', '1'],
      allowNull: false,
      defaultValue: '1',
    },
    profileNotif: {
      type: DataTypes.ENUM,
      values: ['0', '1'],
      allowNull: false,
      defaultValue: '1',
    },
    verificationNotif: {
      type: DataTypes.ENUM,
      values: ['0', '1'],
      allowNull: false,
      defaultValue: '1',
    },
    newsletterNotif: {
      type: DataTypes.ENUM,
      values: ['0', '1'],
      allowNull: false,
      defaultValue: '1',
    },
  });

  User.associate = (model) => {
    User.hasOne(model.Employee, {
      onDelete: 'cascade',
    });

    User.hasMany(model.EmployerDocument, {
      onDelete: 'cascade',
    });

    User.hasOne(model.Employer, {
      onDelete: 'cascade',
    });

    User.hasOne(model.Address, {
      onDelete: 'cascade',
    });

    User.hasMany(model.Chat, {
      onDelete: 'cascade',
    });
    User.hasOne(model.Faq, {
      onDelete: 'cascade',
    });
    User.hasMany(model.Help, {
      onDelete: 'cascade',
    });

    User.hasMany(model.Review, {
      onDelete: 'cascade',
    });

    User.belongsTo(model.Role, {
      foreignKey: 'role_id',
    });

    User.hasMany(model.Activitylog, {
      onDelete: 'cascade',
    });
    User.hasMany(model.Team, {
      onDelete: 'cascade',
    });
    User.hasMany(model.Portfolio, {
      onDelete: 'cascade',
    });
    User.hasMany(model.Skill, {
      onDelete: 'cascade',
    });

    User.belongsToMany(model.Package, {
      through: 'Subscription',
      foreignKey: 'userId',
    });
  };

  return User;
};
