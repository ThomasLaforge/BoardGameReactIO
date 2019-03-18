import { Card } from "./Card";
import { Combination } from "./Combination";

export class Field {

    public cards: Card[] // 12 cards or 3 more until a solution is possible
    
    constructor(initialCards: Card[]){
        this.cards = initialCards
    }

    addCards(cards: Card[]){
        this.cards = this.cards.concat(cards)
    }

    getSolutions(){
        let solutions: Combination[] = []
        for (let i = 0; i < this.cards.length; i++) {
            for (let j = 0; j < this.cards.length; j++) {
                for (let k = 0; k < this.cards.length; k++) {
                    // different cards)
                    if( i !== j && j !== k && k !== i) {
                        const a = this.cards[i]
                        const b = this.cards[j]
                        const c = this.cards[k]
                        let combination = new Combination([a, b, c])
                        if(combination.isValid()){
                            solutions.push(combination)
                        }
                    }
                }
            }
        }

        return solutions
    }

    hasSolution(){
        return this.getSolutions().length > 0
    }

    needMoreCards(){
        return !this.hasSolution()
    }
}