import io from 'socket.io-client';
import { SOCKET_URL } from '../../../constants';
import { ISocketData } from '../types';
import * as Sentry from '@sentry/nextjs';

export function initSocket(handleSocketData: any) {
  const socket = io(window.location.origin, {
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
  socket.on('getBlocksList', (data: ISocketData) => {
    if (isFirst) {
      handleSocketData(data, true);
      isFirst = false;
    } else {
      handleSocketData(data);
    }
  });

  socket.emit('getBlocksList');
  socket.on('connect_error', (error) => {
    // interface 404
    // Sentry.captureException(error);
  });
  return socket;
}
