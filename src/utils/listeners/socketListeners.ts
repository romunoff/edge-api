import { Socket } from 'socket.io';
import { Player } from '../../data/interfaces/Player/Player';
import { SocketEvents } from '../../data/enums/Socket/SocketEvents';

const ROOM_NAME = 'room';

const players = new Set<Player>();

export const socketListeners = (socket: Socket) => {
  socket.join(ROOM_NAME);

  players.add({
    id: socket.id,
    position: {
      x: Math.floor(Math.random() * 5),
      y: 0.5,
      z: Math.floor(Math.random() * 5),
    },
  });

  socket.emit(
    SocketEvents.GET_PLAYER,
    Array.from(players).find((player: Player) => player.id === socket.id),
  );

  socket.to(ROOM_NAME).emit(
    SocketEvents.JOIN_PLAYER,
    Array.from(players).find((player: Player) => player.id === socket.id),
  );

  socket.emit('getActivePlayers', Array.from(players));

  socket.on(SocketEvents.SET_PLAYER, (data) => {
    players.forEach((player: Player) => {
      if (player.id === socket.id) {
        player.position.x = data.x;
        player.position.y = data.y;
        player.position.z = data.z;
      }
    });
    socket.to(ROOM_NAME).emit('getPlayers', Array.from(players));
  });

  socket.on(SocketEvents.DISCONNECT, () => {
    players.forEach((player: Player) => {
      player.id === socket.id && players.delete(player);
    });

    socket.to(ROOM_NAME).emit(SocketEvents.DISCONNECT_PLAYER, socket.id);
  });
};
