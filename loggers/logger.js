const winston = require("winston");

// Custom logger to log exceptionss and unhandeled rejections
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      filename: "./loggers/error.log",
      level: "error",
    }),
    new winston.transports.File({ filename: "./loggers/combined.log" }),
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: "./loggers/exceptions.log" }),
    new winston.transports.Console({
      format: winston.format.json(),
    }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

module.exports = logger;
