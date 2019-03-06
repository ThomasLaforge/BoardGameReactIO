import { Player } from "./Player";
import { Turn } from "./Turn";


export class Game {

    public players: Player[]
    public currentTurn?: Turn
    public history: Turn[]
    public indexFirstPlayer: number
    public winCondition: any | undefined

    constructor(players: Player[], wincondition?: any, indexFirstPlayer = 0){
        this.players = players
        this.history = []
        this.winCondition = wincondition
        this.indexFirstPlayer = indexFirstPlayer
    }



}