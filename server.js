/**
 * Module dependencies.
 */

const chalk = require('chalk');
const http = require('http');
const app = require('./app');
const chatUtils = require('./Utils/chat-users');
const model = require('./Models');

// eslint-disable-next-line import/order
const debug = require('debug')('talentpool:server');
// eslint-disable-next-line import/order
const socketio = require('socket.io');

// normalizePort function returns a valid port, whether it is provided as a number or a string
const normalizePort = (val) => {
  const port = parseInt(val, 10);
  if (!Number.isNaN(port)) {
    return val;
  }

  if (port > 0) {
    return port;
  }

  return false;
};

// normalize and set the port
const port = normalizePort(process.env.PORT || '3000');


const server = http.createServer(app);
const io = socketio(server);


io.on("connection", (socket) => {

  socket.on("user_connected", (data) => {
    const {
      user
    } = chatUtils.addUser({
      id: data.id,
      name: data.name,
      role: data.role
    })

    socket.emit("user_connected",
      chatUtils.generateMessageObject(user.id, user.name, user.role));
  })


  socket.on("message", (message, callback) => {

    model.Chat.create({
      message: message.message,
      read_status: message.read_status,
      receiver_id: message.receiver,
      user_id: message.sender,
    });

    io.emit("message",
      chatUtils.generateMessage(message.id, message.name,
        message.role, message.message));
    callback("Delivered");
  })


  // TODO: Kindly fix where is user object coming from?
  // socket.on("disconnect", () => {
  //   io.emit("offline", chatUtils.generateMessageObject(user.id, user.name, user.role));
  // })

})


// create a http server
server.listen(port, () => {
  const address = server.address();
  const bind = typeof address === 'string' ? `pipe ${address}` : `port ${port}`;
  debug(`Listening on ${chalk.green(bind)}`);
});
