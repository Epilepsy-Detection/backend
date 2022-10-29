const mongoose = require("mongoose");
require("colors");

const logger = require("../loggers/logger");

module.exports = () => {
  // Connecting to the database and logging occuring errors or successfuly connection
  mongoose
    .connect(process.env.MONGO_URI)
    .then((conn) => {
      logger.info(
        `MongoDB connected: ${conn.connection.host}`.cyan.underline.bold
      );
    })
    .catch((err) => {
      console.log(err);
      logger.error(`MongoDB failed to connect ${err}`.red);
    });
};
