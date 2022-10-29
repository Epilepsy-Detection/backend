const apiv1 = require("../routes/APIV1/index");
const error = require("../middleware/error");
const nonExistingRoute = require("../middleware/nonExistingRoute");

module.exports = function (app) {
  // Handle routes to the first version of the API
  app.use("/api/v1", apiv1);

  // Handle non-existing routes
  app.use("*", nonExistingRoute);

  // Handle errors thrown from the prev routes
  app.use(error);
};
