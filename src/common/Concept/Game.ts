import { Player } from "./Player";
import { Turn } from "./Turn";


export class Game {

    public players: Player[]
    public currentTurn?: Turn
    public history: Turn[]
    public winCondition: any | undefined

    constructor(players: Player[], wincondition?: any, indexFirstPlayer = 0){
        this.players = players
        this.history = []
        this.winCondition = wincondition
    }

    startTurn(sentence: string){
        if(!this.currentTurn){
            this.currentTurn = new Turn(this.masterPlayer, sentence)
        }
        else {
            throw new Error('impossible to end turn when undefined');
        }
    }

    endTurn(winner: Player){
        if(this.currentTurn){
            this.currentTurn.addWinner(winner)
            this.history.push(this.currentTurn)
            this.currentTurn = undefined
        }
        else {
            throw new Error('impossible to end turn when undefined');
        }
    }

    getScore(p: Player){
        const accumulatePlayerScore = (sum: number, t: Turn) => sum + t.getScore(p)
        return this.history.reduce(accumulatePlayerScore, 0)
    }

    get masterPlayer(){
        let nbTurn = this.history.length
        let masterIndex = nbTurn % this.nbPlayer
        return this.players[masterIndex]
    }

    get nbPlayer(){
        return this.players.length
    }
}