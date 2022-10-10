import io from 'socket.io-client';
import { SOCKET_URL } from '../../../constants';
import { SocketData } from '../types';

export function initSocket(handleSocketData: any) {
  const socket = io(location.origin, {
    path: SOCKET_URL,
    transports: ['websocket', 'polling'],
  });

  socket.on('reconnect_attempt', () => {
    socket.io.opts.transports = ['polling', 'websocket'];
  });
  socket.on('connection', (data: any) => {
    if (data !== 'success') {
      throw new Error("can't connect to socket");
    }
  });

  let isFirst = true;
  socket.on('getBlocksList', (data: SocketData) => {
    if (isFirst) {
      handleSocketData(data, true);
      isFirst = false;
    } else {
      handleSocketData(data);
    }
  });

  socket.emit('getBlocksList');
  return socket;
}
