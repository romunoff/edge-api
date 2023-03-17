import { Socket } from 'socket.io';

export const socketListeners = (socket: Socket) => {
  socket.on('join', (data) => {
    // eslint-disable-next-line no-console
    console.log(data);

    socket.emit('getSocketId', socket.id);
  });
};
