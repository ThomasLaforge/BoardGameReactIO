import { CardColor } from "./defs";

export class Card {

    constructor(
        public value: number,
        public color: CardColor
    ){}

    isStackable(card: Card) : boolean {
        if(
            Math.abs(this.value - card.value) === 1 ||
            this.value === 1 && card.value === 13 ||
            this.value === 13 && card.value === 1
        ){
            return true
        }

        return false
    }

    hasSameValue(card: Card){
        return this.value === card.value
    }

}