// backend/models/pet.js
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
      dateAddedToSite: {
        field: "date_added_to_site", // actual DB column name
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
      // Now we store the user who created the pet:
      owner_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "users", // your "users" table
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

  return Pet;
};
