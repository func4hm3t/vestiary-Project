// models/KadinProduct.js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'kadinProduct',
    {
      Id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      Title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      Description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      Price: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false
      },
      ImageUrl: {
        type: DataTypes.STRING,
        allowNull: true
      },
      // ► BEDEN ve RENK alanlarını buraya ekle
      beden: {
        type: DataTypes.STRING(10),
        allowNull: true
      },
      renk: {
        type: DataTypes.STRING(30),
        allowNull: true
      }
    },
    {
      tableName:  'KadinProduct',
      timestamps: true,
      createdAt:  'CreatedAt',
      updatedAt:  'UpdatedAt'
    }
  );
};
