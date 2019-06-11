import { Card } from "./Card";
import { Deck } from "./Deck";
import { NB_CARDS_PLAYABLE } from "./defs";

export class Player {

    constructor(
        public username: string,
        public socketid: string,
        public deck = new Deck([])
    ) {}

    getPlayableCards(){
        return this.deck.arrayDeck.slice(0, NB_CARDS_PLAYABLE)
    }

    shuffleDeck(){
        this.deck.shuffle()
    }

    isEqual(player: Player){
        return this.socketid === player.socketid
    }
}