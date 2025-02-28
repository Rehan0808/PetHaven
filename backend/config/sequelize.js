const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,         // Database name
  process.env.DB_USER,         // Database username
  process.env.DB_PASSWORD,     // Database password
  {
    host: process.env.DB_HOST, // Database host
    port: process.env.DB_PORT, // Database port
    dialect: 'postgres',
    logging: false,            // Disable logging if desired
  }
);

// Test the connection
sequelize.authenticate()
  .then(() => console.log('✅ Database connection established successfully'))
  .catch(err => console.error('❌ Unable to connect to the database:', err));

module.exports = sequelize;
