import { ExtendedSocket, ExtendedNamespace } from "./LimiteLimiteServer";
import { SocketPlayer } from "../common/modules/SocketPlayer";
import { Player } from "../common/modules/Player";
import { LimiteLimiteGame } from "../common/modules/LimiteLimiteGame";
import { DEFAULT_IS_PRIVATE_GAME } from '../common/LimiteLimite'

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

    playerEnterGameRoom(game: LimiteLimiteGame){
        this.join(game.id)
        let room = this.baseSocket.server.to(game.id) as ExtendedNamespace
        room.game = game
        this.emit('lobby:player.enter_in_game_table')
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