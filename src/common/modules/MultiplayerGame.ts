import { Game } from "./Game";
import { DEFAULT_IS_PRIVATE_GAME, DEFAULT_NB_PLAYER } from "../LimiteLimite";
import { Player } from "./Player";

export class MultiplayerGame extends Game {

    public nbPlayer: number
    public players: Player[]
    public isPrivate: boolean
    public canBeForcedIsFull?: Function
    private _forcedIsFull: boolean

    constructor(gameClass: any,  isPrivate = DEFAULT_IS_PRIVATE_GAME, nbPlayer = DEFAULT_NB_PLAYER, canBeForcedIsFull?: Function){
        super(gameClass)
        this.isPrivate = isPrivate
        this.players = []
        this.nbPlayer = nbPlayer
        this._forcedIsFull = false
        this.canBeForcedIsFull = canBeForcedIsFull
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