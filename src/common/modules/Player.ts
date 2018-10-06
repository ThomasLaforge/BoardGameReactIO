import { PropositionCard } from "./PropositionCard";
import { Hand } from "./Hand";
import { SocketPlayer } from "./SocketPlayer";
import { serializable, object } from 'serializr';

export class Player extends SocketPlayer {

    @serializable(object(Hand)) public hand: Hand
    @serializable public score: number

    constructor(surname: string, socketid: string, hand = new Hand(), score = 0){
        super(surname, socketid)
        this.hand = hand,
        this.score = score
    }

    win(){
        this.score++
    }

    // Wrapper
    addCard(cards: PropositionCard[]){
        this.hand.add(cards)
    }

    play(card: PropositionCard){
        this.hand.play(card)
    }

    owned(card: PropositionCard){
        return this.hand.cards.findIndex(c => c.content === card.content) !== -1
    }
}