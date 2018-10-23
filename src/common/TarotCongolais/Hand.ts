import { Card } from "./Card";

export class Hand {

    public cards: Card[]

    constructor(cards: Card[] = []){
        this.cards = cards
    }

    addCards(cards: Card[]){
        this.cards = this.cards.concat(cards)
    }

    playCard(card: Card){
        this.cards = this.cards.filter(c => c.value !== card.value)
    }

}