// models/KadinProduct.js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('KadinProduct', {
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
    tableName:  'KadinProducts',
    timestamps: true,
    createdAt:  'CreatedAt',
    updatedAt:  'UpdatedAt'
  });
};
