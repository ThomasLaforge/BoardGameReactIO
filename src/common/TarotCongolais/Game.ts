import {Deck} from './Deck';
import {Player} from './Player';
import {Card} from './Card';
import {Trick} from './Trick';
import {Turn} from './Turn';
import {History} from './History';
import {DEFAULT_NB_PLAYER, ExcuseValue, Bet, Play} from './TarotCongolais'

export class Game {
	
    public deck:Deck;
    public players: Player[];
	public turn:Turn;
	public actualTrick:Trick;
	public history: Turn[]

    constructor(players: Player[]){
        this.players          = players;
		this.deck             = new Deck();
		this.actualTrick 	  = new Trick(this.players);
		this.turn 			  = new Turn(this.turnCards, this.players);
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
			let newPlayerCards = this.deck.drawCards(this.turnCards);
			p.hand.addCards(newPlayerCards);
		});
	}

	// Turn
	addTrick() {
		this.turn.addTrick(this.actualTrick);
		this.actualTrick = new Trick(this.players);
	}


	nextTurn(){
		if( this.turnCards > 1 ) {
			this.turnCards--;
		} else { 
			this.turnCards = Math.floor( 22 / this.getNbPlayer() );
			this.changeFirstPlayer();
		}
		this.actualTrick = new Trick(this.players);
		this.turn = new Turn(this.turnCards, this.players);
	}

    changeFirstPlayer(){
		this.players.changeFirstPlayer();
    }

	// Play
	addPlay(play: Play){
		// Action
		play.player.playCard(play.card)
		let trickWinner = this.actualTrick.addPlay( play );
		if(trickWinner){
			this.addTrick();
		}
		// History
		let action = new ActionHistory(GameAction.Play, play.card, play.player.username);
		this.history.push(action);
	}

	// Bet
	addBet(bet: Bet){
		this.turn.addbet(bet)
	}

	/**
	 * Getters
	 */

	// Play
	getPlayedCard(p: Player){
		let play = this.actualTrick.arrPlay.filter(play => { return play.player.username === p.username })[0]
		return play ? play.card : null
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

	// State
	getPlayerGameState(p: Player){
		let state = GameState.WaitingPlayers;

		if(this.isFull()){ 
			state = GameState.WaitingPlayersToBeReady
			if(!this.isReady(p)){
				state = GameState.WaitingToBeReady
			}
            
            if(this.areAllPlayersReady()) { 
                state = GameState.WaitingPlayersToBet

                if(this.areAllPlayersBet()){ 
                    state = GameState.WaitingPlayersToPlay
                    if(this.isPlayerToPlay(p)){
                        state = GameState.Play
                    } 
                }
                else{
                    if(this.isPlayerToBet(p)){
                        state = GameState.Bet;
                    }
                }
            }
        }
    
		return state;
	}

	getNbPlayer(){
		return this.players.length
	}
    
}