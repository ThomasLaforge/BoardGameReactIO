import { DEFAULT_IS_PRIVATE_GAME, DEFAULT_NB_PLAYER } from "../LimiteLimite";
import { LimiteLimiteGame } from "./LimiteLimiteGame";
import { Player } from "./Player";

export class Game {
    public gameClass: any
    public game: LimiteLimiteGame | null
    public isPrivate: boolean
    public id: string
    public nbPlayer: number
    public players: Player[]
    private _forcedIsFull: boolean


    constructor(gameClass: any, isPrivate = DEFAULT_IS_PRIVATE_GAME, nbPlayer = DEFAULT_NB_PLAYER){
        this.gameClass = gameClass
        this.game = null
        this.isPrivate = isPrivate
        this.id = Date.now().toString()
        this.nbPlayer = nbPlayer
        this.players = []
        this._forcedIsFull = false
    }

    start(){
        this.game = new this.gameClass()
    }
    
    addPlayer(p: Player){
        this.players.push(p)
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

}