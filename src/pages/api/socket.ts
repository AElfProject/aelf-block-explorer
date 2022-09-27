import { Server } from 'socket.io';
import { SOCKET_URL } from 'constants/index';
export default function SocketHandler(req, res, handleSocketData) {
  // It means that socket server was already initialised
  if (res.socket.server.io) {
    console.log('Already set up');
    res.end();
    return;
  }

  const io = new Server(res.socket.server, {
    path: SOCKET_URL,
    transports: ['websocket', 'polling'],
  });
  res.socket.server.io = io;

  const onConnection = (socket) => {
    console.log(socket, 'socket');
    if (socket !== 'success') {
      //throw new Error("can't connect to socket");
    }
  };
  io.on('reconnect_attempt', () => {
    res.socket.server.io.opts.transports = ['polling', 'websocket'];
  });
  // Define actions inside
  io.on('connection', onConnection);

  let isFirst = true;
  io.on('getBlocksList', (socket) => {
    if (isFirst) {
      handleSocketData(socket, true);
      isFirst = false;
    } else {
      handleSocketData(socket);
    }
  });

  io.emit('getBlocksList');

  console.log('Setting up socket');
  res.end();
}
