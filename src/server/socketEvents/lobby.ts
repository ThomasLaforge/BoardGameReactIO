import { SuperSocket } from '../SuperSocket';
import { GameCollection, LimiteLimiteGame, GameType, DEFAULT_IS_PRIVATE_GAME } from '../../common';
import { MultiplayerGame } from '../../common/modules/MultiplayerGame';

export const addLobbyEvents = (socket: SuperSocket, GC: GameCollection) => {
  // connect on game room by matchmaking
  socket.on('lobby:auto', (gameType: GameType) => {
    let game: MultiplayerGame;
    // get game room id by auto matchmaking
    let gameRoomId = GC.getRandomAndNotFullGameRoomId(gameType);
    console.log('getRandomAndNotFullGameRoomId : ' + gameRoomId)
    if(!gameRoomId) {
      game = socket.createNewGame(gameType)
      GC.addGame(game)
      gameRoomId = game.id
    }
    else {
      game = GC.getGame(gameRoomId) as MultiplayerGame
      game.addPlayer(socket.getOrCreatePlayer())
    }

    console.log('lobby-auto : ' + gameRoomId + ', ' + socket.username)
    socket.playerEnterGameRoom(game)
  })

  // connect on game room selecting a game
  socket.on('lobby:join', (gameRoomId: string) => {
      console.log('lobby-join : ' + gameRoomId + ', ' + socket.player.surname)
      let game = GC.getGame(gameRoomId) as MultiplayerGame 
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
  socket.on('lobby:create', (gameType: GameType, isPrivate = DEFAULT_IS_PRIVATE_GAME) => {
    let game = socket.createNewGame(gameType, isPrivate)
    console.log('lobby-create : ' + game.id + ', ' + socket.player.surname)
    GC.addGame(game);
    socket.playerEnterGameRoom(game)
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
} 