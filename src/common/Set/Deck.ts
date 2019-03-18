import { Card } from "./Card";
import { shuffle, flattenDeep } from 'lodash'
import { SHAPES, FILLINGS, COLORS, NUMBERS, DEFAULTS_CARDS } from "./definitions";

export class Deck {

    public cards: Card[]

    constructor(cards: Card[] = DEFAULTS_CARDS.slice(), toShuffle = true){
        this.cards = cards
        if(toShuffle){
            this.shuffle()
        }
    }

    init(){
        this.cards = DEFAULTS_CARDS.slice()
    }

    shuffle(){
        this.cards = shuffle(this.cards)
    }

    drawCards(nbCards = 1){
        const cards = this.cards.slice(0, nbCards)
        this.cards = this.cards.slice(nbCards, this.cards.length)
        return cards
    }

    get length(){
        return this.cards.length
    }
}