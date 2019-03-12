import {Deck} from './Deck';
import {Player} from './Player';
import {Trick} from './Trick';
import {Turn} from './Turn';
import {Bet, Play, GamePhase} from './TarotCongolais'
import { Card } from './Card';
import { SocketPlayer } from '../modules/SocketPlayer';

export class Game {
	
    public deck: Deck;
    public players: Player[];
	public turn: Turn;
	public actualTrick: Trick;
	public history: Turn[];

    constructor(players: SocketPlayer[]){
		this.history 		  = []
		this.players          = players.map(socketPlayer => new Player(socketPlayer.surname, socketPlayer.socketid));
		this.deck             = new Deck();
		this.actualTrick 	  = new Trick(this.players);
		this.turn 			  = new Turn(this.getNbCardForTurn(), this.players);
		
		this.shufflePlayers()
	}

	/**
	 * Game actions
	 */

	shufflePlayers(){
		this.players = this.players.sort(function() {
			return .5 - Math.random();
		});
	}

	start(){
		this.dealCards();
	}

	dealCards(){
		this.players.forEach( p => {
			let newPlayerCards = this.deck.drawCards(this.getNbCardForTurn());
			p.hand.addCards(newPlayerCards);
		});
	}

	// Turn
	addTrick() {
		this.turn.addTrick(this.actualTrick);
		if(this.turn.isComplete()){
			this.nextTurn()
		}
		else {
			this.actualTrick = new Trick(this.players);
		}
	}

	isOnBetPhase(){
		return !this.turn.allPlayersBet
	}
	isOnPlayPhase(){
		return this.turn.allPlayersBet && this.turn.arrTrick.length < this.players.length
	}

	nextTurn(){
		console.log('Game:nextTurn', this.turn.arrTrick)
		this.players.forEach(p => {
			const playerHasLost = this.turn.getLosers().findIndex(loser => loser.isEqual(p)) !== -1
			if(playerHasLost){
				p.losePV()
			}
		})

		this.history.push(this.turn)
		// resets
		this.actualTrick = new Trick(this.players);
		this.turn = new Turn(this.getNbCardForTurn(), this.players);

		this.deck = new Deck()
		this.dealCards()
	}

	// Play
	addPlay(play: Play, autoEndTrick = true){
		// Action
		play.player.playCard(play.card)
		let trickWinner = this.actualTrick.addPlay( play );
		if(trickWinner && autoEndTrick){
			this.addTrick();
		}
	}

	// Bet
	addBet(bet: Bet){
		this.turn.addbet(bet)

		// solo card turn
		if(this.turn.allPlayersBet() && this.turn.nbCards === 1){
			this.players.forEach(player => { 
				let card = player.hand.cards[0]
				this.addPlay({ player, card }) 
			})
		}
	}

	/**
	 * Getters
	 */

	// Play
	getPlayedCard(p: Player) : Card {
		let play = this.actualTrick.arrPlay.filter(play => { return play.player.username === p.username })[0]
		return play && play.card
	}
	isPlayerToPlay(p: Player){
		return this.areAllPlayersBet() && this.actualTrick.isPlayerToPlay(p)
	}

	// Turn
	getNbWonTrick(player: Player){
		return this.turn.getNbWonTricks(player)
	}

	getBet(p: Player){
		return this.turn.getBetFromPlayer(p)
	}
	isPlayerToBet(p: Player){
		return this.turn.isPlayerToBet(p)
	}
	areAllPlayersBet(){
		return this.turn.allPlayersBet()
	}

	getPlayer(socketid: string){
		return this.players.find(p => p.socketid === socketid) as Player
	}

	getNextPlayerIndex(){
		return (this.firstPlayerIndex + this.getTurnIndex()) % this.getNbPlayer()
	}

	get firstPlayerIndex(){
		let nbPlayers = this.getNbPlayer()
		let nbCards = new Deck().length

		let nbTurnByPlayer = Math.floor(nbCards / nbPlayers)
		
		let nbTurnTotal = this.history.length

		return Math.floor(nbTurnTotal / nbTurnByPlayer) % nbPlayers
	}

	getNbPlayer(){
		return this.players.length
	}
	
	getTurnIndex(){
		let nbPlayers = this.getNbPlayer()
		let nbCards = new Deck().length

		let nbTurnByPlayer = Math.floor(nbCards / nbPlayers)
		
		let nbTurnTotal = this.history.length

		return nbTurnTotal % nbTurnByPlayer
	}

	getNbCardForTurn(turnindex = this.getTurnIndex()){
		const nbPlayers = this.getNbPlayer()
		const nbCards = new Deck().length
		const nbTurnByPlayer = Math.floor(nbCards / nbPlayers)
		const nbCardForTurn = nbTurnByPlayer - turnindex

		// To test little turns with 2 people
		// return nbCardForTurn >= 5 ? 5 : nbCardForTurn
		
		// To test turn with one card
		// return 1
		
		// turns 2 and 1
		// return (nbTurnByPlayer - turnindex) % 2 + 1

		return nbTurnByPlayer - turnindex
	}

	// Get players with First player Point Of Vue
	get playersFPOV(){
		let playersFPOV: Player[] = []
		
		playersFPOV.push( ...this.players.slice(this.firstPlayerIndex, this.players.length) ) 
		playersFPOV.push( ...this.players.slice(0, this.firstPlayerIndex) )

		return playersFPOV
	}

	isGameOver(){
		return this.players.filter(p => p.pv === 0).length > 0
	}

	getGamePhase(){
		return this.turn.allPlayersBet() ? GamePhase.Play : GamePhase.Bet
	}

	isLastPlayer(p:Player){
		return this.players[this.getNbPlayer() - 1].isEqual(p)
	}

}