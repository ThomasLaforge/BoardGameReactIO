import { Player } from "./Player";
import { PropositionDeck, SentenceDeck } from "./Deck";
import { NB_CARD_IN_HAND, DEFAULT_IS_PRIVATE_GAME, DEFAULT_NB_TURN, ITurn, PropSent } from "../LimiteLimite";
import { SentenceCard } from "./SentenceCard";
import { PropositionCard } from "./PropositionCard";

export class LimiteLimiteGame {

    constructor(
        public players: Player[], 
        public nbTurnToPlay = DEFAULT_NB_TURN, 
        public propsDeck = new PropositionDeck(), 
        public sentencesDeck = new SentenceDeck(),
        public mainPlayerIndex = 0,
        public propsSent: PropSent[] = [],
        public history: ITurn[] = []
    ){}
    
    startGame(){
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
                this.history.push({
                    sentence: this.currentSentenceCard,
                    propositions: this.propsSent
                })
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

    getMainPlayerSocketId(): string {
        return this.players[this.mainPlayerIndex].socketid
    }

    getPropsPlayersSocketIds(): string[] {
        return this.players.filter((p, i) => i !== this.mainPlayerIndex).map(p => p.socketid)
    }

    getPlayer(socketId: string){
        return this.players.find(p => p.socketid === socketId) as Player
    }

    isFirstPlayer(socketId: string){
        return this.players && this.players[0] && this.players[0].socketid === socketId
    }

    isGameOver(){
        return this.nbTurnToPlay !== 0 && this.nbTurnToPlay === this.nbTurnPlayed
    }

    get nbTurnPlayed(){
        return this.history.length
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