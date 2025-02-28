// backend/models/pet.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Pet = sequelize.define(
    "Pet",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      species: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          isIn: [["dog", "cat", "rat", "chicken", "bunny"]],
        },
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      fee: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      gender: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
          isIn: [["male", "female"]],
        },
      },
      date_added_to_site: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      zip: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      town: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      adopted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      owner_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "users", // The table name in your DB
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    },
    {
      tableName: "pets",
      timestamps: false,
    }
  );

  // Optionally, define associations here:
  // Pet.associate = (models) => {
  //   Pet.belongsTo(models.User, { foreignKey: 'owner_id' });
  // };

  return Pet;
};
