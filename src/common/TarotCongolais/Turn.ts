import {Trick} from './Trick';
import {Player} from './Player';
import {Bet} from './TarotCongolais';

export class Turn {

    public players: Player[];
    public nbCards: number;
    public arrTrick:Trick[];
    public arrBet:Bet[];

	constructor(nbCards: number, players: Player[], arrTrick: Trick[] = [], arrBet: Bet[] = []) {
        this.players = players;
        this.nbCards = nbCards;
		this.arrTrick = arrTrick;
		this.arrBet = arrBet;
	}

    getLosers(): Player[] {
        let res: Player[] = [];

        this.players.forEach( player => {
            let score:number = 0;
            
            this.arrTrick.forEach(trick => {
                if( trick.isComplete() && player.isEqual(trick.getWinner() as Player) ){
                    score++;
                }
            });

            if(score != this.getBetFromPlayer(player)){
                res.push(player);
            }
        });

        return res;
    }

    allPlayersBet(){
        return this.getPlayersHavingBet().length === this.players.length;
    }

    getPlayersHavingBet(): Player[]{
        let res:Player[] = [];

        this.arrBet.forEach(bet => {
            res.push(bet.player);
        });

        return res;
    }

    getBetFromPlayer(player:Player){
        let bet = this.arrBet.find(bet => bet.player.isEqual(player))
        return bet && bet.bet;
    }

    isPlayerToBet(player: Player){
        let nbPlayerAlreadyBet = this.arrBet.length;
        const playerIndex = this.players.findIndex(p => p.isEqual(player))

        return playerIndex === nbPlayerAlreadyBet
    }

    addbet(bet:Bet){
        let player = bet.player;
        if( this.isPlayerToBet(player) ) {
            this.arrBet.push(bet);
            console.log('arr bet after bet', this.arrBet)
        }
        else{
            throw new Error('Not good player to bet');
        }
    }

    playerAlreadyBet(p:Player){
        let res:boolean = false;
        this.arrBet.forEach( bet => {
            if(bet.player.socketid, p.socketid){
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

    getLastTrick(){
        if(this.arrTrick.length === 0){
            throw 'try to access last trick of empty array'
        }
        return this.arrTrick[this.arrTrick.length - 1]
    }

    allPlayersPlay(){
        return this.arrTrick.length === this.nbCards
    }

    isComplete(){
        return this.nbCards === 1 ? this.allPlayersBet() : this.allPlayersPlay()
    }

}