

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const app = require("./app");
const sequelize = require("./config/sequelize");


const startServer = async () => {
  try {
    // Connect to PostgreSQL using Sequelize
    await sequelize.authenticate();
    console.log("✅ Database connection established successfully");

    // Sync Sequelize models (creates/updates tables as needed)
    await sequelize.sync();
    console.log("✅ Database synced (tables created/updated)");

    // Start Express server
    const port = process.env.PORT || 8001;
    app.listen(port, () => {
      console.log(`🚀 Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("❌ Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
