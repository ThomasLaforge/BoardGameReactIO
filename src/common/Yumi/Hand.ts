import { Card } from "./Card";
import { YUMI_MIN_VALUE } from "./defs";

export class Hand {

    constructor(
        public cards: Card[]
    ){}

    getValue(){
        return this.cards.reduce( (sum, c) => sum + c.cost, 0)
    }

    canYumi(){
        return this.getValue() <= YUMI_MIN_VALUE
    }

    addCards(cards: Card[]){
        this.cards = [...this.cards, ...cards]
    }
}