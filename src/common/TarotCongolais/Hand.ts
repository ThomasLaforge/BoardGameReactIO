import {serializable, list, object} from 'serializr'

import { Card } from "./Card";

export class Hand {
    
    @serializable(list(object(Card))) public cards: Card[]

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