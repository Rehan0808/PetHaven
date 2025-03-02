// backend/models/user.js

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      tableName: "users",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  /**
   * Static method: findUserByEmail
   * @param {string} email - User's email
   * @returns {Promise<User | null>} - User instance or null
   */
  User.findUserByEmail = async function (email) {
    try {
      return await this.findOne({ where: { email } });
    } catch (error) {
      console.error("Error finding user by email:", error);
      return null;
    }
  };

  /**
   * Static method: createUser
   * @param {Object} userData - { username, email, password }
   * @returns {Promise<User>} - Newly created User instance
   */
  User.createUser = async function (userData) {
    try {
      return await this.create(userData);
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  };

  return User;
};
