const { activeConnections } = require("./dataStorage");

module.exports.removeConnection = (socketId) => {
  const connection =  activeConnections[socketId];
  delete activeConnections[socketId];

  return connection;
}