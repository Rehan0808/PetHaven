// src/models/pet.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize"); // adjust path if needed

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
        // Must match one of these EXACT lowercase strings
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
        // Must be either "male" or "female"
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

    // ALLOW owner_id to be NULL so old pets don't break
    owner_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // <--- CHANGED to true
      references: {
        model: "users", // the table name in your DB
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

module.exports = Pet;
