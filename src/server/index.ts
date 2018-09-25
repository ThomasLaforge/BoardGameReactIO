import * as express from 'express';
import * as nodeHttp from 'http'
import * as socketIo from 'socket.io';
import { PropositionCard } from '../modules/PropositionCard';
import { serialize, deserialize } from 'serializr';
import { SentenceCard } from '../modules/SentenceCard';
import { PropositionDeck } from '../modules/Deck';
import { LimiteLimiteGame } from '../modules/LimiteLimiteGame';

const app = express()
const http = new nodeHttp.Server(app);
const io = socketIo(http);

// app.get('/', function(req, res){
//   res.sendFile(__dirname + '/index.html');
// });

io.on('connection', function(socket: any){
  console.log('a user connected', socket.id);
  
  socket.on('message', (message: string) => {
    console.log('message received', message)
  })
});




http.listen(3000, function(){
  console.log('listening on *:3000');
});

// test serializer
// let prop = new PropositionCard('banane')
// console.log(serialize(prop), deserialize(PropositionCard, { content: 'test' }))

// let propDeck = new PropositionDeck([prop])
// console.log(serialize(propDeck), deserialize(PropositionDeck, {cards: [{ content: 'test' }]} ))

// let sentence = new SentenceCard(['mon premier est', null])
// console.log(serialize(sentence), deserialize(SentenceCard, { sentences: [null, 'test'] }))

// let game = new LimiteLimiteGame()