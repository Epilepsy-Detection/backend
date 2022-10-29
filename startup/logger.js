const requestsLogger = require("../loggers/requestsLogger");

module.exports = (app) => {
  app.use(requestsLogger);
};
