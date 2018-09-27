import { PropositionCard } from "./PropositionCard";

export class Hand {

    public cards: PropositionCard[]

    constructor(cards: PropositionCard[] = []){
        this.cards = cards
    }

    add(cards: PropositionCard[]){
        this.cards = this.cards.concat(cards)
    }

    play(card: PropositionCard){
        let pos = this.cards.indexOf(card)
        if(pos !== -1){
            let cards = this.cards.slice()
            cards.splice(pos, 1)
            this.cards = cards
        }
    }

}