import { CardColor } from "./defs";
import { serializable } from "serializr";

export class Card {
    
    @serializable public value: number
    @serializable public color: CardColor

    constructor(value: number, color: CardColor){
        this.value = value
        this.color = color
    }

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