const socketio = require("socket.io");
const Cache = require("./cache");
let instance = null;
class SocketService {
  static Initialize(server) {
    instance = socketio(server);
    return instance;
  }
  static getInstance() {
    return instance;
  }
}

module.exports = SocketService;
