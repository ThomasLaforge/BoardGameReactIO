import { Card } from "./Card";
import { uniq } from 'lodash'
import { CardProperty } from "./definitions";

export class Combination {

    public cards: Card[]

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
        return this.cards.length === 3
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