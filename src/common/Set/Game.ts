import { Field } from "./Field";
import { SocketPlayer } from "../modules/SocketPlayer";
import { Deck } from "./Deck";
import { Turn } from "./Turn";
import { Player } from "./Player";
import { NB_DEFAULT_CARDS_ON_FIELD, NB_CARDS_TO_ADD_ON_FIELD } from "./definitions";

export class Game {

    public deck: Deck;
    public players: Player[];
    public field: Field
	public history: Turn[];

    constructor(players: SocketPlayer[]){
		this.history 		  = []
		this.players          = players.map(p => new Player(p.surname, p.socketid))
		this.deck             = new Deck();
        this.field            = new Field([])
        this.initField()
    }

    nextTurn(){
        const cards = this.deck.drawCards(NB_CARDS_TO_ADD_ON_FIELD)
        this.field.addCards(cards)

        while( !this.field.hasSolution() && !this.isGameOver()) {
            this.nextTurn()
        }
    }

    // Field
    initField(){
        const cards = this.deck.drawCards(NB_DEFAULT_CARDS_ON_FIELD)
        this.field.addCards(cards)
        while( !this.field.hasSolution() && !this.isGameOver()) {
            this.nextTurn()
        }
    }

    // Scores
    getPlayerScore(p: Player){
        return this.history.filter(t => t.player.isEqual(p)).length
    }

    getWinners(){
        let winnerScore = 0
        let winners: Player[] = []
        this.players.forEach(p => {
            let score = this.getPlayerScore(p)
            if(score > winnerScore){
                winnerScore = score
                winners = [p]
            }
            else if(score === winnerScore){
                winners.push(p)
            }
        })
        return winners
    }

    isGameOver(){
        return this.deck.length === 0 && !this.field.hasSolution()
    }

    get nbPlayer(){
        return this.players.length
    }
    
}