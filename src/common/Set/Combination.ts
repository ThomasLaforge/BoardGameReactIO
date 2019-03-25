import { Card } from "./Card";
import { uniq } from 'lodash'
import { CardProperty, NB_CARDS_FOR_COMBINATION } from "./definitions";
import { serializable, list, object } from "serializr";

export class Combination {

    @serializable(list(object(Card))) public cards: Card[]

    constructor(cards: Card[]){
        this.cards = cards
    }

    isValid(){
        return  this.isComplete() &&
                this.sameOrAllDifferentColor() &&
                this.sameOrAllDifferentShape() &&
                this.sameOrAllDifferentNumber() &&
                this.sameOrAllDifferentFilling()
    }

    isComplete(){
        return this.cards.length === NB_CARDS_FOR_COMBINATION
    }

    sameOrAllDifferentColor(){
        return this.sameOrAllDifferentProperty(CardProperty.Color)
    }
    sameOrAllDifferentShape(){
        return this.sameOrAllDifferentProperty(CardProperty.Shape)        
    }
    sameOrAllDifferentNumber(){
        return this.sameOrAllDifferentProperty(CardProperty.Number)        
    }
    sameOrAllDifferentFilling(){
        return this.sameOrAllDifferentProperty(CardProperty.Filling)
    }

    sameOrAllDifferentProperty(property: CardProperty){
        return this.hasSame(property) || this.hasAllDifferent(property)
    }

    getUniqByProperty(property: CardProperty) {
        return uniq(this.cards.map(c => c[property]))
    }
    hasSame(property: CardProperty){
        return this.getUniqByProperty(property).length === 1
    }
    hasAllDifferent(property: CardProperty){
        return this.getUniqByProperty(property).length === this.cards.length        
    }

}