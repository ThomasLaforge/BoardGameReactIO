import { SuperSocket } from '../SuperSocket';
import {SocketIoDescriptor} from '../SocketIoDescriptor'
import { SocketPlayer } from '../../common/modules/SocketPlayer';

export const addLoginEvents = (socket: SuperSocket) => {
  // Connexion
  socket.on('login:new_user', (username: string) => {
    username = username && username.trim()

    const server = new SocketIoDescriptor(socket.server)
    console.log('try to login', username)
    // care of trim + case insensitive
    if(username && server.allUsernames.map(u => u && u.toUpperCase()).includes(username.toUpperCase())){
      socket.emit('login:player.username_already_exists', username)
    }
    else {
      socket.username = username.trim()
      socket.join('lobby');
      let p = new SocketPlayer(socket.username, socket.id);
      socket.socketPlayer = p;
      socket.emit('login:player.login_accepted', socket.username)
      // socket.baseSocket.broadcast.to('lobby').emit('login:lobby.new_player_connected', socket.username);
    }
  })
} 