import {Trick} from './Trick';
import {Player} from './Player';
import {Bet} from './Bet';
import {PlayerCollection} from './PlayerCollection';
import * as  _ from 'lodash';

export class Turn {

    private _playerCollection: PlayerCollection;
    private _nbCards: number;
    private _arrTrick:Trick[];
    private _arrBet:Bet[];

	constructor(nbCards: number, pc: PlayerCollection, arrTrick: Trick[] = [], arrBet: Bet[] = []) {
        this.playerCollection = pc;
        this.nbCards = nbCards;
		this.arrTrick = arrTrick;
		this.arrBet = arrBet;
	}

    getLosers(): Player[] {
        let res: Player[] = [];

        this.playerCollection.arrPlayers.forEach( player => {
            let score:number = 0;
            
            this.arrTrick.forEach(trick => {
                if( _.isEqual(trick.getWinner(), player) ){
                    score++;
                }
            });

            if(score != this.getBetFromPlayer(player)){
                res.push(player);
            }
        });

        return res;
    }

    allPlayerBet(){
        return this.getPlayersHavingBet().length === this.playerCollection.getNbPlayer();
    }

    getPlayersHavingBet(): Player[]{
        let res:Player[] = [];

        this.arrBet.forEach(bet => {
            res.push(bet.player);
        });

        return res;
    }

    getBetFromPlayer(player:Player){
        let res:number;

        this.arrBet.forEach(bet => {
            if(bet.player == player){
                res = bet.bet;
            }
        });

        return res;
    }

    isPlayerToBet(player: Player){
        let nbPlayerAlreadyBet = this.arrBet.length;
        let playerToBet = this.playerCollection.getPlayersPOV(this.playerCollection.getFirstPlayer())[ nbPlayerAlreadyBet-1 + 1];
        
        return _.isEqual(playerToBet, player)
    }

    addbet(bet:Bet){
        let player = bet.player;
        if( this.isPlayerToBet(player) ) {
            this.arrBet.push(bet);
        }
        else{
            throw new Error('Not good player to bet');
        }
    }

    playerAlreadyBet(p:Player){
        let res:boolean = false;
        this.arrBet.forEach( bet => {
            if(_.isEqual(bet.player,p)){
                res = true;
            }
        })
        return res;
    }

    addTrick(trick: Trick){
        this.arrTrick.push(trick)
    }

    getNbWonTricks(player: Player){
        let sum = 0;
        this.arrTrick.forEach( t => { 
            if( t.isWinner(player) ) {
                sum++
            }
        })
        return sum;
    }

    /**
     * Getters / Setters
     */
	public get arrTrick(): Trick[] {
		return this._arrTrick;
	}
	public set arrTrick(value: Trick[]) {
		this._arrTrick = value;
	}
	public get arrBet(): Bet[] {
		return this._arrBet;
	}
	public set arrBet(value: Bet[]) {
		this._arrBet = value;
	}
	public get playerCollection(): PlayerCollection {
		return this._playerCollection;
	}
	public set playerCollection(value: PlayerCollection) {
		this._playerCollection = value;
	}
	public get nbCards(): number {
		return this._nbCards;
	}
	public set nbCards(value: number) {
		this._nbCards = value;
	}
    
    
    

}