const setupLogger = require("./logger");
const setupRoutes = require("./routes");
const setupBodyParsing = require("./body");
const setupDB = require("ep-det-core/startup-modules/db");

const logger = require('../loggers/logger');

module.exports = (app) => {
  setupLogger(app);
  setupDB(logger);
  setupBodyParsing(app);
  setupRoutes(app);
};
