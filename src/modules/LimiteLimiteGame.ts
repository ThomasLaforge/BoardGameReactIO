import { Player } from "./Player";
import { Deck } from "./Deck";

export class LimiteLimiteGame {

    public players: Player[]
    public deck: Deck;

    constructor(players: Player[], deck: Deck){
        this.players = players
        this.deck = deck
    }

    nextTurn(){
        this.players.forEach(p => {
            let card = this.deck.pick(1)
            p.addCard(card)
        })
    }

}