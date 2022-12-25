require("dotenv").config();
require("colors");

const express = require("express");
require("express-async-errors");

const logger = require("./loggers/logger");

const app = express();

require("./startup")(app);

const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
  logger.info(`App is listening on port: ${PORT}`.bgGreen);
});
