import { Player } from "./Player";
import { Deck } from "./Deck";
import { NB_PLAYER } from "./defs";
import { Stack } from "./Stack";
import { Card } from "./Card";
import { SocketPlayer } from "../modules/SocketPlayer";

export class Game {

    public players: Player[]

    constructor(
        players: SocketPlayer[],
        public deck = new Deck(),
        public stacks = [new Stack([deck.drawOneCard()]), new Stack([deck.drawOneCard()])]
    ) {    
        this.players = players.map(p => new Player(p.surname, p.socketid))
        const nbCardsToDraw = Math.floor(this.deck.length / (NB_PLAYER))
        this.players.forEach( (p, i) => {
            const cards = this.deck.drawCards(nbCardsToDraw)
            p.deck.addCards(cards)
        })
    }

    start(){
    }

    callStress(player: Player){
        if(this.stacks[0].topCard === this.stacks[1].topCard){
            // Opponent take cards on field
            const opponent = this.getOpponent(player)
            const allStackCards = this.stacks.reduce(
                (cards: Card[], stack) => cards.concat(stack.cards),
                []
            )
            opponent.deck.addCards(allStackCards)
            
            // shuffle players decks
            this.players.forEach(p => p.shuffleDeck())
        }
    }

    putCard(player: Player, cardIndex: number, stackIndex: number){
        let cardAdded = false
        
        const stack = this.stacks[stackIndex]
        const card = player.deck.arrayDeck[cardIndex]

        if(stack.topCard && card.isStackable(stack.topCard)){
            stack.cards.push(card)
            player.deck.removeCard(cardIndex)
            cardAdded = true
        }

        return cardAdded
    }

    getOpponent(player: Player){
        return this.players[this.getOpponentIndex(player)]
    }
    getOpponentIndex(player: Player){
        return (this.getPlayerIndex(player) + 1) % NB_PLAYER  
    }
    getPlayerIndex(player: Player){
        return this.players.findIndex(p => p.isEqual(player))
    }

    isGameOver(){
        return this.players.filter(p => p.deck.length === 0).length > 0
    }
    getWinner(){
        return this.players.find(p => p.deck.length === 0)
    }
}