// backend/models/adoption.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Adoption = sequelize.define('Adoption', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    pet_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    adopted_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'adoptions',
    timestamps: false,
  });

  return Adoption;
};
