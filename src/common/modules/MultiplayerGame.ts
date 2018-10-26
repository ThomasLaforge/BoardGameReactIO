import { Game } from "./Game";
import { DEFAULT_IS_PRIVATE_GAME, DEFAULT_NB_PLAYER } from "../LimiteLimite";
import { GameType } from "..";
import { SocketPlayer } from "./SocketPlayer";

export class MultiplayerGame extends Game {

    public nbPlayer: number
    public players: SocketPlayer[]
    public isPrivate: boolean
    public canBeForcedIsFull?: Function
    private _forcedIsFull: boolean

    constructor(gameType: GameType,  isPrivate = DEFAULT_IS_PRIVATE_GAME, nbPlayer = DEFAULT_NB_PLAYER, canBeForcedIsFull?: Function){
        super(gameType)
        this.isPrivate = isPrivate
        this.players = []
        this.nbPlayer = nbPlayer
        this._forcedIsFull = false
        this.canBeForcedIsFull = canBeForcedIsFull
    }

    start(){
        super.start(this.players)
    }
   
    addPlayer(p: SocketPlayer){
        this.players = this.players.concat(p)
    }
    
    removePlayer(socketId: string){
        this.players = this.players.filter(p => p.socketid !== socketId)
    }
    
    get playersNames(){
        return this.players.map(p => p.surname)
    }

    get isFull(){
        return this._forcedIsFull || this.nbPlayer === this.players.length
    }

    isFirstPlayer(socketid: string){
        return this.players[0] && this.players[0].socketid === socketid 
    }

    getPlayer(socketId: string){
        return this.players.find(p => p.socketid === socketId) as SocketPlayer
    }

    getPlayerIndex(p: SocketPlayer){
        return this.players.findIndex(player => player.socketid === p.socketid) as number
    }

}