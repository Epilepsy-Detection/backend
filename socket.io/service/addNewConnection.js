const { activeConnections } = require("./dataStorage");


module.exports.addNewConnection = (socketId, user) => {
    const connection = {
        socketId,
        userId: user._id,
        profileId: user._profileId,
        role: user.role
    }

    activeConnections[socketId] = connection;
}