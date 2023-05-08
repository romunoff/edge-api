import { Socket } from 'socket.io';
import { Player } from '../../data/interfaces/Player/Player';
import { SocketEvents } from '../../data/enums/Socket/SocketEvents';
import { createRandomHexColor } from '../helpers/colors-helper';

const ROOM_NAME = 'room';
const MAX_ROOM_SIZE = 2;

const players = new Set<Player>();
const finish = {
  position: { x: 0, y: 0.01, z: 0 },
  color: 'red',
};

export const socketListeners = (socket: Socket) => {
  socket.join(ROOM_NAME);

  if (players.size < MAX_ROOM_SIZE) {
    const position: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 };

    if (!players.size) {
      position.y = 0.5;
      position.z = -3;
    } else {
      position.y = 0.5;
      position.z = 3;
    }

    players.add({
      id: socket.id,
      position,
      color: createRandomHexColor(),
    });
  }

  socket.emit('getFinish', finish);

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

    if (Math.round(data.x) === finish.position.x && Math.round(data.z) === finish.position.z) {
      socket.emit('getWinner', socket.id);
      socket.to(ROOM_NAME).emit('getWinner', socket.id);
    }
  });

  socket.on(SocketEvents.DISCONNECT, () => {
    players.forEach((player: Player) => {
      player.id === socket.id && players.delete(player);
    });

    socket.to(ROOM_NAME).emit(SocketEvents.DISCONNECT_PLAYER, socket.id);
  });
};
