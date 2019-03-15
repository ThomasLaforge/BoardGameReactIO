import { Card } from "./Card";

export class Deck {

    public cards: Card[]

    constructor(cards: Card[] = []){
        this.cards = cards
    }

}