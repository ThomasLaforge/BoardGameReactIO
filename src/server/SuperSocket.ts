import { ExtendedSocket, ExtendedNamespace } from "./LimiteLimiteServer";
import { SocketPlayer } from "../common/modules/SocketPlayer";
import { Player } from "../common/modules/Player";
import { LimiteLimiteGame } from "../common/modules/LimiteLimiteGame";
import { DEFAULT_IS_PRIVATE_GAME } from '../common/LimiteLimite'
import { PlayerListUI, PlayerListUIElt } from "../common";

export class SuperSocket {

    public baseSocket: ExtendedSocket

    constructor(socket: ExtendedSocket){
        this.baseSocket = socket
    }

    on(action: string, listener: (...argsListener: any[]) => void){
        this.baseSocket.on(action, (...args) => {
            console.log(this.username || this.baseSocket.id ,' receive : ', action)
            listener(...args)
        })
    }

    emit(messageType: string, ...data: any[]){
        console.log(this.username || this.baseSocket.id ,' send : ', messageType)
        return this.baseSocket.emit(messageType, ...data)
    }

    join(roomName: string | string[]){
        console.log(this.username || this.baseSocket.id ,' join : ', roomName)
        this.baseSocket.join(roomName)
    }

    leave(roomName: string){
        console.log(this.username || this.baseSocket.id ,' leave : ', roomName)
        this.baseSocket.leave(roomName)
    }

    playerEnterGameRoom(game: LimiteLimiteGame){
        this.join(game.id)
        this.leave('lobby');
        let room = this.baseSocket.server.to(game.id) as ExtendedNamespace
        room.game = game
        this.emit('lobby:player.enter_in_game_table')
    }

    sendGameInfos(game: LimiteLimiteGame){
        const uiPlayers: PlayerListUI = game.players.map(p => {
            let isFirstPlayer = game.isFirstPlayer(p.socketid)
            return {
                name: p.surname,
                score: p.score,
                isFirstPlayer,
                hasPlayed: !isFirstPlayer && game.playerHasPlayed(p)
            } as PlayerListUIElt
        })
        // console.log('game:player.ask_initial_infos', game.id, uiPlayers, game.isFirstPlayer(socket.id), initialChat)
        let myIndex = game.getPlayerIndex(game.getPlayer(this.id))
        this.emit('game:player.ask_initial_infos', game.id, uiPlayers, game.isFirstPlayer(this.id), myIndex)
        this.baseSocket.to(game.id).broadcast.emit('game:players.new_player', uiPlayers)
    }

    createNewGame(isPrivate = DEFAULT_IS_PRIVATE_GAME){
        return new LimiteLimiteGame(this.getOrCreatePlayer(), isPrivate)
    }

    getOrCreatePlayer(){
        this.player = this.player || new Player(this.baseSocket.username, this.baseSocket.id)
        return this.player
    }

    get server(): SocketIO.Server { return this.baseSocket.server }

    get username(){ return this.baseSocket.username}
    set username(username: string){ this.baseSocket.username = username }

    get socketPlayer(){ return this.baseSocket.socketPlayer}
    set socketPlayer(player: SocketPlayer){ this.baseSocket.socketPlayer = player }

    get player(){ return this.baseSocket.player}
    set player(player: Player){ this.baseSocket.player = player }

    get id(){
        return this.baseSocket.id
    }

}