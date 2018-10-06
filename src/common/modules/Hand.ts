import { PropositionCard } from "./PropositionCard";
import { serializable, object, list } from "serializr";

export class Hand {
    @serializable(list(object(PropositionCard))) public cards: PropositionCard[]

    constructor(cards: PropositionCard[] = []){
        this.cards = cards
    }

    add(cards: PropositionCard[]){
        this.cards = this.cards.concat(cards)
    }

    play(card: PropositionCard){
        let pos = this.cards.findIndex(c => c.content === card.content)
        if(pos !== -1){
            let cards = this.cards.slice()
            cards.splice(pos, 1)
            this.cards = cards
        }
    }

}