import { Player } from "./Player";
import { PropositionDeck, SentenceDeck } from "./Deck";
import { NB_CARD_IN_HAND } from "../LimiteLimite";

export class LimiteLimiteGame {

    public players: Player[]
    public firstPlayerIndex: number;
    public propsDeck: PropositionDeck;
    public sentencesDeck: SentenceDeck;
    public id: string
    public complete: boolean

    constructor(player: Player, propsDeck = new PropositionDeck(), sentencesDeck = new SentenceDeck()){
        this.complete = false
        this.id = Date.now().toString()
        this.players = [player]
        this.propsDeck = propsDeck
        this.sentencesDeck = sentencesDeck
        this.firstPlayerIndex = 0
    }

    nextTurn(){
        this.players.forEach(p => {
            let card = this.propsDeck.pick(1)
            p.addCard(card)
        })
        this.sentencesDeck.pick(1)
    }

    startGame(){
        this.complete = true
        // TODO: fix random
        this.firstPlayerIndex = Math.floor(Math.random() * this.players.length)
        // give cards
        this.players.forEach(p => {
            let cards = this.propsDeck.pick(NB_CARD_IN_HAND)
            p.hand.add(cards)
        })
    }

    addPlayer(p: Player){
        this.players.push(p)
    }

    get currentSentenceCard() {
        return this.sentencesDeck.firstCard
    }

}