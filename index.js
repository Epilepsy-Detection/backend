const express = require("express");
const { createServer } = require("http");

const app = express();
const httpServer = createServer(app);

require("./startup")(app);
require("./socket.io/setup/ioServer")(httpServer);

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(`App is listening on port: ${PORT}`);
});
