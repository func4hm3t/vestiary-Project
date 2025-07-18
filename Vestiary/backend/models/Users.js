module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    Id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    Username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    PasswordHash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Role: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'Users',
    timestamps: true,
    createdAt: 'CreatedAt',
    updatedAt: 'UpdatedAt'
  });

  return User;
};
