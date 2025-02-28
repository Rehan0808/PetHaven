// backend/models/donationCampaign.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const DonationCampaign = sequelize.define("DonationCampaign", {
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
  }, {
    tableName: "donation_campaigns",
    timestamps: false,
  });

  return DonationCampaign;
};
