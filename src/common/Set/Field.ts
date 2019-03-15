import { Card } from "./Card";

export class Field {

    public cards: Card[]
    
    constructor(initialCards: Card[]){
        this.cards = initialCards
    }

    addCard(card: Card){
        this.cards = this.cards.concat(card)
    }

}