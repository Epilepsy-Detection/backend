const setupLogger = require("./logger");
const setupRoutes = require("./routes");
const setupConfig = require("./config");

module.exports = (app) => {
  setupLogger(app);
  setupConfig();
  setupRoutes(app);
};
