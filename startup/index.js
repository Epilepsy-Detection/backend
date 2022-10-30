const setupLogger = require("./logger");
const setupRoutes = require("./routes");
const setupConfig = require("./config");
const setupDB = require("./db");
const setupBodyParsing = require("./body");

module.exports = (app) => {
  setupLogger(app);
  setupConfig();
  setupDB();
  setupBodyParsing(app);
  setupRoutes(app);
};
