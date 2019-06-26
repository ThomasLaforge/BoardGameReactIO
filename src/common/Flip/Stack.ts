import { Card } from "./Card";

export class Stack {

    constructor(
        public cards: Card[] = []
    ){}

    get topCard(){
        return this.cards.length < 1 ? null : this.cards[this.cards.length - 1]
    }
}