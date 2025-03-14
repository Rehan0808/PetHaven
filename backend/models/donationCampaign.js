// models/donationCampaign.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const DonationCampaign = sequelize.define(
    "DonationCampaign",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      pet_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      max_donation: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      // Keep not-null, so the DB always has a date
      last_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      short_info: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      long_description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      image_path: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "donation_campaigns",
      timestamps: false, // or true if you want createdAt/updatedAt
    }
  );

  return DonationCampaign;
};
