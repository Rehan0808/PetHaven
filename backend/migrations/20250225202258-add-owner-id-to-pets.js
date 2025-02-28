'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add the "owner_id" column, allowing NULL for existing rows
    await queryInterface.addColumn('pets', 'owner_id', {
      type: Sequelize.INTEGER,
      allowNull: true, // <= allow null so old pets don't break
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove "owner_id" if this migration is rolled back
    await queryInterface.removeColumn('pets', 'owner_id');
  },
};
