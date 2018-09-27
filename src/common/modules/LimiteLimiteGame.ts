import { Player } from "./Player";
import { PropositionDeck, SentenceDeck } from "./Deck";

export class LimiteLimiteGame {

    public players: Player[]
    public propsDeck: PropositionDeck;
    public sentencesDeck: SentenceDeck;

    constructor(players: Player[] = [], propsDeck = new PropositionDeck(), sentencesDeck = new SentenceDeck()){
        this.players = players
        this.propsDeck = propsDeck
        this.sentencesDeck = sentencesDeck
    }

    nextTurn(){
        this.players.forEach(p => {
            let card = this.propsDeck.pick(1)
            p.addCard(card)
        })
    }

}