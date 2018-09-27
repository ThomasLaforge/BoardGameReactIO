import * as express from 'express';
import * as nodeHttp from 'http'
import * as socketIo from 'socket.io';
import { SuperSocket } from './SuperSocket';
import { ChatMessage } from '../common/Server';
// import { serialize, deserialize } from 'serializr';
// import { SentenceCard } from '../modules/SentenceCard';
// import { PropositionDeck } from '../modules/Deck';
// import { LimiteLimiteGame } from '../modules/LimiteLimiteGame';

const app = express()
const http = new nodeHttp.Server(app);
const io = socketIo(http);

// app.get('/', function(req, res){
//   res.sendFile(__dirname + '/index.html');
// });

io.on('connection', (classicSocket: socketIo.Socket) => {
  let socket = new SuperSocket(classicSocket)
  console.log('a user connected', socket.id);
  
  socket.on('message', (message: string) => {
    console.log('message received', message)
  })

  socket.on('login', (username: string) => {
    console.log('login', username)
    socket.emit('login_accepted', username, 1)
    socket.username = username
  })

  socket.on('chat-sendMessage', (message: string) => {
    let chatMsg: ChatMessage = {username: socket.username || 'unknown', msg: message}
    console.log('new message to send', chatMsg)
    io.sockets.emit('newMessage', chatMsg)
  })

  // Debugs
  socket.on('debug-getAllSockets', () => {
    console.log('ask getAllSockets')
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