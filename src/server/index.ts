import * as express from 'express';
import * as nodeHttp from 'http'
import * as socketIo from 'socket.io';
import { serialize, deserialize } from 'serializr';
import { ChatMessage } from '../common/Server';
import { PlayerListUI, PlayerListUIElt } from '../common/LimiteLimiteUI'
import { Player } from '../common/modules/Player';

import { SuperSocket } from './SuperSocket';
import { ExtendedSocket } from './LimiteLimiteServer';
import { SocketIoDescriptor } from './SocketIoDescriptor';

import { LimiteLimiteGame } from '../common/modules/LimiteLimiteGame';
import { SocketPlayer } from '../common/modules/SocketPlayer';
import { GameCollection } from '../common/modules/GameCollection';
import { PropositionCard } from '../common';

// import { SentenceCard } from '../modules/SentenceCard';
// import { PropositionDeck } from '../common/modules/Deck';
// import { LimiteLimiteGame } from '../modules/LimiteLimiteGame';

const app = express()
const http = new nodeHttp.Server(app);
const io = socketIo(http);
const server = new SocketIoDescriptor(io)

let hasLoggedAllSocketEvents = false
// app.get('/', function(req, res){
//   res.sendFile(__dirname + '/index.html');
// });

let GC = new GameCollection()

// INFO: naming of "on" events and emit: Category:portée.main_mission/sub_mision_or_state
// ex: on Lobby:create_game/succes
// ex: emit Lobby:player.create_game/succes

io.on('connection', (baseSocket: ExtendedSocket) => {  
  let socket = new SuperSocket(baseSocket)
  console.log('a user connected', socket.id);
  
  socket.on('disconnect', () => {
    let game = GC.getGameWithUser(socket.id)
    if(game){
      let gameHasStarted = game.isFull
      if(gameHasStarted){
        // delete the game
        GC.removeGame(game.id)
      }
      else {
        // remove player
        game.removePlayer(socket.id)
      }
      socket.baseSocket.to(game.id).emit('game:user_disconnect', socket.username, gameHasStarted)
    }
  })
  // Connexion
  socket.on('login:new_user', (username: string) => {
    username = username && username.trim()
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


  // Lobby
  // socket.on('lobby:auto_find_game', () => {
  //   let player = new Player(socket.username, socket.id)
  //   let game = new LimiteLimiteGame(player)
  //   socket.join(game.id)
  //   let room = io.to(game.id) as ExtendedNamespace
  //   room.game = game
  //   socket.emit('lobby:player.enter_in_game_table', game.id)
  // })

    // connect on game room by matchmaking
  socket.on('lobby:auto', () => {
    let game: LimiteLimiteGame;
    // get game room id by auto matchmaking
    let gameRoomId = GC.getRandomAndNotFullGameRoomId();
    console.log('getRandomAndNotFullGameRoomId : ' + gameRoomId)
    if(!gameRoomId) {
      game = socket.createNewGame()
      GC.addGame(game)
      gameRoomId = game.id
    }
    else {
      game = GC.getGame(gameRoomId) as LimiteLimiteGame
      game.addPlayer(socket.getOrCreatePlayer())
    }

    console.log('lobby-auto : ' + gameRoomId + ', ' + socket.username)
    socket.playerEnterGameRoom(game)
  })

  // connect on game room selecting a game
  socket.on('lobby:join', (gameRoomId: string) => {
      console.log('lobby-join : ' + gameRoomId + ', ' + socket.player.surname)
      let game = GC.getGame(gameRoomId) 
      if( game ) {
          if( !game.isFull ){
              socket.playerEnterGameRoom(game)
          }
          else{
              socket.emit('lobby:player.join_game/is_already_full', gameRoomId)
          }
      }
      else{
          socket.emit('lobby:player.join_game/undefined_gameroom', gameRoomId)
      }
      
  })

  // connect on game room creating a game
  socket.on('lobby:create', () => {
    let game = socket.createNewGame()
    console.log('lobby-create : ' + game.id + ', ' + socket.player.surname)
    GC.addGame(game);
    socket.playerEnterGameRoom(game)
  })

  // Game
  socket.on('game:ask_initial_infos', () => {
    let game = GC.getGameWithUser(socket.id)
    if(game){
      // let initialChat: ChatMessage[] = []
      socket.sendGameInfos(game)
    }
  })
  
  socket.on('game:start', () => {
    let game = GC.getGameWithUser(socket.id)
    if(game){
      game.startGame()
      const sentence = serialize(game.currentSentenceCard)
      
      io.to(`${game.getMainPlayerSocketId()}`).emit('game:mp.start', sentence)
      game.getPropsPlayersSocketIds().forEach(socketId => {
        const p = (game as LimiteLimiteGame).getPlayer(socketId)
        const hand = p && serialize(p.hand)
        io.to(`${socketId}`).emit('game:op.start', sentence, hand)
      })
    }
  })

  socket.on('game:send_prop', (propositionCardJSON: any) => {
    let game = GC.getGameWithUser(socket.id)
    if(game){
      // game
      let propositionCard = deserialize(PropositionCard, [propositionCardJSON])
      console.log('after send prop', propositionCardJSON, propositionCard, game.propsSent, game.canResolveTurn());
      game.sendProp(propositionCard[0], socket.getOrCreatePlayer())
      
      if(game.canResolveTurn()){
        socket.server.in(game.id).emit('game:players.turn_to_resolve', game.propsSent.map(p => p.prop))
      }
      else {
        socket.emit('game:player.player_has_played')
      }
    }
  })

  socket.on('game:end_turn', (propositionCardIndex: number) => {
    let game = GC.getGameWithUser(socket.id)
    console.log('socket end turn:', !!game, propositionCardIndex)
    if(game){
      game.endTurn(propositionCardIndex)
      const sentence = serialize(game.currentSentenceCard)
      
      console.log(game.getMainPlayerSocketId(), game.getPropsPlayersSocketIds());
      io.to(`${game.getMainPlayerSocketId()}`).emit('game:mp.new_turn', sentence)
      game.getPropsPlayersSocketIds().forEach(socketId => {
        const p = (game as LimiteLimiteGame).getPlayer(socketId)
        const hand = p && serialize(p.hand)
        io.to(`${socketId}`).emit('game:op.new_turn', sentence, hand)
      })

      socket.sendGameInfos(game)
    }
  })  

  // Chats
  socket.on('chat:send_message', (message: string, channel?: string) => {
      console.log('channel', channel);
      channel = channel || 'lobby'
      
      let chatMsg: ChatMessage = {username: socket.username || 'unknown', msg: message.trim()}
      socket.baseSocket.to(channel).emit('chat:new_message', chatMsg)
      socket.emit('chat:new_message', chatMsg)
  })

  // Debugs
  socket.on('debug:get_all_sockets', () => {
    console.log('ask getAllSockets', server.allUsernames)
    io.clients( (err: any, clients: any[]) => {
      socket.emit('debug:get_all_sockets', clients)
    })
  })

  // logging events
  if(!hasLoggedAllSocketEvents){
    console.log('allEvents', baseSocket.eventNames())
    hasLoggedAllSocketEvents = true
  }
});


http.listen(3027, function(){
  console.log('listening on *:3027');
});

// test serializer
// let prop = new PropositionCard('banane')
// console.log(serialize(prop), deserialize(PropositionCard, { content: 'test' }))

// let propDeck = new PropositionDeck()
// console.log('prop deck', propDeck)
// console.log(serialize(propDeck), deserialize(PropositionDeck, {cards: [{ content: 'test' }]} ))

// let sentence = new SentenceCard(['mon premier est', null])
// console.log(serialize(sentence), deserialize(SentenceCard, { sentences: [null, 'test'] }))

// let game = new LimiteLimiteGame()