// backend/models/index.js
"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";

// If you use a config.js file with dev/prod/test inside it:
const configPath = path.join(__dirname, "../config/config.js");

// Or if you have config.json, you might do:
// const configPath = path.join(__dirname, "../config/config.json");

let config;
if (fs.existsSync(configPath)) {
  // If it's a JS file that exports an object { development: {...}, production: {...} }, etc.
  config = require(configPath)[env];
} else {
  console.error(`Error: Missing config file at ${configPath}`);
  process.exit(1);
}

const db = {};

let sequelize;
if (config.use_env_variable) {
  // e.g. config.use_env_variable = "DATABASE_URL"
  if (!process.env[config.use_env_variable]) {
    console.error(`Error: Missing environment variable ${config.use_env_variable}`);
    process.exit(1);
  }
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  // Connect with local config credentials
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Read all model files in this directory (besides index.js)
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  })
  .forEach((file) => {
    const modelFactory = require(path.join(__dirname, file));
    const model = modelFactory(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// If any models have associations defined, call them here
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Attach Sequelize and the sequelize instance to db
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
