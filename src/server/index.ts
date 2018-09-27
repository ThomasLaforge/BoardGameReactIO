import * as express from 'express';
import * as nodeHttp from 'http'
import * as socketIo from 'socket.io';
import { SuperSocket, ExtendedSocket } from './SuperSocket';
import { ChatMessage } from '../common/Server';
import { Player } from '../common/modules/Player';
import { LimiteLimiteGame } from '../common/modules/LimiteLimiteGame';
import { SocketIoDescriptor } from './SocketIoDescriptor';
// import { serialize, deserialize } from 'serializr';
// import { SentenceCard } from '../modules/SentenceCard';
// import { PropositionDeck } from '../modules/Deck';
// import { LimiteLimiteGame } from '../modules/LimiteLimiteGame';

interface ExtendedNamespace extends SocketIO.Namespace {
  game: LimiteLimiteGame
}

const app = express()
const http = new nodeHttp.Server(app);
const io = socketIo(http);
const server = new SocketIoDescriptor(io)
// app.get('/', function(req, res){
//   res.sendFile(__dirname + '/index.html');
// });

io.on('connection', (classicSocket: ExtendedSocket) => {
  let socket = new SuperSocket(classicSocket)
  console.log('a user connected', socket.id);

  // Connexion
  socket.on('login', (username: string) => {
    console.log('try to login', username)
    // care of trim + case insensitive
    if(server.allUsernames.map(u => u && u.toUpperCase()).includes(username.trim().toUpperCase())){
      socket.emit('login_usernameAlreadyExists', username)
    }
    else {
      socket.emit('login_accepted', username)
      socket.username = username.trim()
    }
  })

  // Lobby
  socket.on('lobby-autoFindGame', () => {
    socket.emit('enterInGameTable', Date.now().toString())
    let player = new Player(socket.username, socket.id)
    let game = new LimiteLimiteGame(player)
    classicSocket.join(game.id)
    let room = io.to('some room') as ExtendedNamespace
    room.game = game
    // io.to(game.id).emit('')
  })

  // Chats
  socket.on('chat-sendMessage', (message: string) => {
    let chatMsg: ChatMessage = {username: socket.username || 'unknown', msg: message}
    console.log('new message to send', chatMsg)
    io.sockets.emit('newMessage', chatMsg)
  })

  // Debugs
  socket.on('debug-getAllSockets', () => {
    console.log('ask getAllSockets', server.allUsernames)
    io.clients( (err: any, clients: any[]) => {
      socket.emit('getAllSockets', clients)
    })
  })

});




http.listen(3027, function(){
  console.log('listening on *:3027');
});

// test serializer
// let prop = new PropositionCard('banane')
// console.log(serialize(prop), deserialize(PropositionCard, { content: 'test' }))

// let propDeck = new PropositionDeck([prop])
// console.log(serialize(propDeck), deserialize(PropositionDeck, {cards: [{ content: 'test' }]} ))

// let sentence = new SentenceCard(['mon premier est', null])
// console.log(serialize(sentence), deserialize(SentenceCard, { sentences: [null, 'test'] }))

// let game = new LimiteLimiteGame()