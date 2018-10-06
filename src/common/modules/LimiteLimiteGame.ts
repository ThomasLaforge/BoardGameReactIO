import { Player } from "./Player";
import { PropositionDeck, SentenceDeck } from "./Deck";
import { NB_CARD_IN_HAND, DEFAULT_IS_PRIVATE_GAME } from "../LimiteLimite";
import { SentenceCard } from "./SentenceCard";
import { PropositionCard } from "./PropositionCard";

export interface PropSent {
    playerIndex: number,
    prop: PropositionCard[]
}

export class LimiteLimiteGame {

    public players: Player[]
    public mainPlayerIndex: number;
    public propsDeck: PropositionDeck;
    public sentencesDeck: SentenceDeck;
    public id: string
    public isFull: boolean
    public isPrivate: boolean
    public propsSent: PropSent[]

    constructor(player: Player, isPrivate = DEFAULT_IS_PRIVATE_GAME, propsDeck = new PropositionDeck(), sentencesDeck = new SentenceDeck()){
        this.isFull = false
        this.id = Date.now().toString()
        this.players = [player]
        this.propsDeck = propsDeck
        this.sentencesDeck = sentencesDeck
        this.mainPlayerIndex = 0
        this.isPrivate = isPrivate
        this.propsSent = []
    }
    
    startGame(){
        this.isFull = true
        this.mainPlayerIndex = Math.floor(Math.random() * this.players.length)
        // give cards
        this.players.forEach(p => {
            let cards = this.propsDeck.pick(NB_CARD_IN_HAND)
            p.hand.add(cards)
        })
    }

    nextTurn(){
        this.players.forEach(p => { 
            let propSent = this.getPropSentBy(p)
            console.log('next turn', this.propsSent, propSent)
            if(propSent){
                let cardsPlayedLastTurn = propSent.prop
                // console.log('before hand play', p.hand.cards.length, cardsPlayedLastTurn.content);
                p.hand.play(cardsPlayedLastTurn)
                // console.log('after hand play', p.hand.cards.length);
                let card = this.propsDeck.pick(cardsPlayedLastTurn.length)
                p.addCard(card)
            }
            else {
                // throw Error('next turn: can\'t find card played last turn')
            }
        })
        this.sentencesDeck.pick(1)
        this.propsSent = []
    }

    getPropSentBy(p: Player){
        return this.propsSent.find(prop => {
            let player = this.players[prop.playerIndex]
            return player.socketid === p.socketid
        })
    }

    sendProp(prop: PropositionCard[], player: Player){
        this.propsSent.push({
            prop,
            playerIndex: this.getPlayerIndex(player)
        })
    }

    endTurn(propIndex: number){
        let prop = this.propsSent[propIndex]
        let playerIndex = prop.playerIndex
        console.log('Gae:endTurn', propIndex, prop);
        
        if(playerIndex !== -1){
            let player = this.players[playerIndex]
            player.score++
            this.nextTurn()
            this.mainPlayerIndex = playerIndex
        }
        else {
            throw Error('no player with this proposition card')
        }
    }

    canResolveTurn(){
        console.log('can resolve turn', this.propsSent.length, this.players.length - 1)
        return this.propsSent.length === this.players.length - 1
    }

    addPlayer(p: Player){
        this.players.push(p)
    }

    removePlayer(socketId: string){
        this.players = this.players.filter(p => p.socketid !== socketId)
    }

    getMainPlayerSocketId(): string {
        return this.players[this.mainPlayerIndex].socketid
    }

    getPropsPlayersSocketIds(): string[] {
        return this.players.filter((p, i) => i !== this.mainPlayerIndex).map(p => p.socketid)
    }

    getPlayer(socketId: string){
        return this.players.find(p => p.socketid === socketId)
    }

    isFirstPlayer(socketId: string){
        return this.players && this.players[0] && this.players[0].socketid === socketId
    }

    get currentSentenceCard(): SentenceCard {
        return this.sentencesDeck.firstCard
    }

    getPlayerIndex(p: Player){
        return this.players.findIndex(player => player.socketid === p.socketid) as number
    }

    get nbPlayers(){
        return this.players.length
    }
    get playersNames(){
        return this.players.map(p => p.surname)
    }

}