const setupLogger = require("./logger");
const setupRoutes = require("./routes");
const setupConfig = require("./config");
const setupDB = require("./db");

module.exports = (app) => {
  setupLogger(app);
  setupConfig();
  setupDB();
  setupRoutes(app);
};
