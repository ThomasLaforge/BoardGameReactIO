import { Game } from "./Game";
import { DEFAULT_IS_PRIVATE_GAME, DEFAULT_NB_PLAYER } from "../LimiteLimite/LimiteLimite";
import { DEFAULT_NB_PLAYER as DEFAULT_NB_PLAYER_TC } from "../tarotcongolais/tarotcongolais";
import { SocketPlayer } from "./SocketPlayer";

export class MultiplayerGame extends Game {

    public nbPlayer: number
    public players: SocketPlayer[]
    public isPrivate: boolean
    public canBeForcedIsFull?: Function
    private _forcedIsFull: boolean

    constructor(gameType: string,  isPrivate = DEFAULT_IS_PRIVATE_GAME, nbPlayer?: number, canBeForcedIsFull?: Function){
        super(gameType)
        this.isPrivate = isPrivate
        this.players = []
        this._forcedIsFull = false
        this.canBeForcedIsFull = canBeForcedIsFull

        if(!nbPlayer){
            switch (gameType) {
                case 'tarotcongolais':
<<<<<<< HEAD
                    nbPlayer = DEFAULT_NB_PLAYER_TC; break;
=======
                    nbPlayer = 5; break;
>>>>>>> c6a78bf562fb966fd8068e0e232457b4e8cc3e56
                default:
                    nbPlayer = DEFAULT_NB_PLAYER; break;
            }
        }
        this.nbPlayer = nbPlayer
    }

    start(){
        console.log('multiplayer game start', this.canStart())
        if(this.canStart()){
            super.start(this.players)
            this._forcedIsFull = true
        }
        else {
            throw Error('can\t start the game')
        }
    }

    canStart(){
        return this.nbPlayer === 0
            || ( this.nbPlayer > 0 && this.players.length === this.nbPlayer )
            || ( this.nbPlayer < 0 && this.players.length > Math.abs(this.nbPlayer) )
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