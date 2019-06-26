import { Player } from "./Player";
import { Deck } from "./Deck";
import { Stack } from "./Stack";
import { Card } from "./Card";
import { SocketPlayer } from "../modules/SocketPlayer";
import { NB_INITIAL_CARDS, LIMIT_SCORE } from "./defs";

export class Game {

    public players: Player[]

    constructor(
        players: SocketPlayer[],
        public deck = new Deck()
    ) {    
        this.players = players.map(p => new Player(p.surname, p.socketid))
        this.startNewTurn()
    }

    addPlayerBet(p: Player, bet: number){
        if(bet < 1 || bet > LIMIT_SCORE){
            throw Error('bet not on range: [1, ' + LIMIT_SCORE + ']')
        }
        
        p.objectif = bet
    }

    endTurn(yumiPlayer: Player){
        
    }

    startNewTurn(){
        this.deck = new Deck()
        this.players.forEach( (p, i) => {
            const cards = this.deck.drawCards(NB_INITIAL_CARDS)
            p.hand.cards = cards
        })
    }

    canStartGame(){
        return this.players.filter(p => !!p.objectif).length === this.getNbPlayer()
    }
    
    callYumi(player: Player){
    }

    putCards(player: Player, cardsIndex: number[]){
    }

    getPlayerIndex(player: Player){
        return this.players.findIndex(p => p.isEqual(player))
    }
    getPlayer(socketId: string){
        return this.players.find(p => p.socketid === socketId)
    }
    getNbPlayer(){
        return this.players.length
    }

    isGameOver(){
        return this.players.filter(p => p.hasLost()).length > 0
    }
    
    get orderedPlayers(){
        let playersCopy = this.players.slice()
        playersCopy.sort( (a, b) => a.score - b.score)
        return playersCopy
    }
    
    getWinner(){
        return this.orderedPlayers[0]
    }
}