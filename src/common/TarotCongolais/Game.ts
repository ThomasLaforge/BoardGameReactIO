import {Deck} from './Deck';
import {Player} from './Player';
import {Trick} from './Trick';
import {Turn} from './Turn';
import {Bet, Play} from './TarotCongolais'
import { Card } from './Card';
import { SocketPlayer } from '../modules/SocketPlayer';

export class Game {
	
    public deck:Deck;
    public players: Player[];
	public turn:Turn;
	public actualTrick:Trick;
	public history: Turn[]

	public firstPlayerIndexAtStart: number;

    constructor(players: SocketPlayer[], firstPlayerIndexAtStart?: number, deck = new Deck()){
		this.players          = players.map(socketPlayer => new Player(socketPlayer.surname, socketPlayer.socketid));
		this.firstPlayerIndexAtStart = firstPlayerIndexAtStart || Math.floor((Math.random() * this.players.length));
		this.deck             = new Deck();

		this.actualTrick 	  = new Trick(this.players);
		this.turn 			  = new Turn(this.getTurnCards(), this.players);
		
		this.history 		  = []
	}

	/**
	 * Game actions
	 */

	start(){
		this.dealCards();
	}

	dealCards(){
		this.players.forEach( p => {
			let newPlayerCards = this.deck.drawCards(this.getTurnCards());
			p.hand.addCards(newPlayerCards);
		});
	}

	// Turn
	addTrick() {
		this.turn.addTrick(this.actualTrick);
		this.actualTrick = new Trick(this.players);
	}


	nextTurn(){
		// add turn to history
		this.history.push(this.turn)
		// resets
		this.actualTrick = new Trick(this.players);
		this.turn = new Turn(this.getTurnCards(), this.players);
	}

	// Play
	addPlay(play: Play){
		// Action
		play.player.playCard(play.card)
		let trickWinner = this.actualTrick.addPlay( play );
		if(trickWinner){
			this.addTrick();
		}
	}

	// Bet
	addBet(bet: Bet){
		this.turn.addbet(bet)
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
		return this.actualTrick.isPlayerToPlay(p)
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
		return this.turn.allPlayerBet()
	}

	getPlayer(socketid: string){
		return this.players.find(p => p.socketid === socketid) as Player
	}

	getNbPlayer(){
		return this.players.length
	}
	
	getTurnCards(){
		let nbPlayers = this.getNbPlayer()
		let nbCards = new Deck().length

		let nbTurnByPlayer = Math.floor(nbCards / nbPlayers)
		
		let nbTurnTotal = this.history.length

		return nbTurnTotal % nbTurnByPlayer
	}
}