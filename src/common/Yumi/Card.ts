import { CardColor } from "./defs";

export class Card {

    constructor(
        public color: CardColor,
        public value: number
    ){}

    hasSameValue(c: Card){
        return c.value === this.value
    }

    get cost(){
        if(this.value === 1){
            return -1
        }
        else {
            return this.value > 10 ? 10 : this.value
        }
    }

}