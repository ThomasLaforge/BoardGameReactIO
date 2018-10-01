import { Player } from "./Player";
import { PropositionDeck, SentenceDeck } from "./Deck";
import { NB_CARD_IN_HAND, DEFAULT_IS_PRIVATE_GAME } from "../LimiteLimite";
import { SentenceCard } from "./SentenceCard";

export class LimiteLimiteGame {

    public players: Player[]
    public firstPlayerIndex: number;
    public propsDeck: PropositionDeck;
    public sentencesDeck: SentenceDeck;
    public id: string
    public isFull: boolean
    public isPrivate: boolean

    constructor(player: Player, isPrivate = DEFAULT_IS_PRIVATE_GAME, propsDeck = new PropositionDeck(), sentencesDeck = new SentenceDeck()){
        this.isFull = false
        this.id = Date.now().toString()
        this.players = [player]
        this.propsDeck = propsDeck
        this.sentencesDeck = sentencesDeck
        this.firstPlayerIndex = 0
        this.isPrivate = isPrivate
    }

    nextTurn(){
        this.players.forEach(p => {
            let card = this.propsDeck.pick(1)
            p.addCard(card)
        })
        this.sentencesDeck.pick(1)
    }

    startGame(){
        this.isFull = true
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

    removePlayer(socketId: string){
        this.players = this.players.filter(p => p.socketid !== socketId)
    }

    isFirstPlayer(socketId: string){
        return this.players && this.players[0] && this.players[0].socketid === socketId
    }

    get currentSentenceCard(): SentenceCard {
        return this.sentencesDeck.firstCard
    }

    get nbPlayers(){
        return this.players.length
    }
    get playersNames(){
        return this.players.map(p => p.surname)
    }

}