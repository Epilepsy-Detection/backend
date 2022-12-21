const setupLogger = require("./logger");
const setupRoutes = require("./routes");
const setupDB = require("./db");
const setupBodyParsing = require("./body");

module.exports = (app) => {
  setupLogger(app);
  setupDB();
  setupBodyParsing(app);
  setupRoutes(app);
};
