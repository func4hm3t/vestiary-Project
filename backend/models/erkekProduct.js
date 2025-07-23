// models/ErkekProduct.js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('ErkekProduct', {
    Id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    Title:       { type: DataTypes.STRING,      allowNull: false },
    Description: { type: DataTypes.TEXT,        allowNull: true  },
    Price:       { type: DataTypes.DECIMAL(10,2), allowNull: false },
    ImageUrl:    { type: DataTypes.STRING,      allowNull: true  }
  }, {
    tableName:  'ErkekProducts',
    timestamps: true,
    createdAt:  'CreatedAt',
    updatedAt:  'UpdatedAt'
  });
};
