import { PropositionCard } from "./PropositionCard";
import { Hand } from "./Hand";
import { SocketPlayer } from "./SocketPlayer";

export class Player extends SocketPlayer {

    public hand: Hand
    public score: number

    constructor(surname: string, socketid: string, hand: Hand, score = 0){
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

}