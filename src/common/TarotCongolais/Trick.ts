import { Player } from './Player';
import { Card } from './Card';
import { Play } from './TarotCongolais';

// Trick = un pli
export class Trick {

    public arrPlay: Play[];
    public players: Player[];

    constructor(playerCollection: Player[], arrPlay: Play[] = []){
        this.players = playerCollection;
        this.arrPlay = arrPlay;
    }

    addPlay(play:Play){
        let player = play.player;
        if( this.isPlayerToPlay(player) ) {
            this.arrPlay.push(play);
            return this.getWinner()
        }
        else{
            throw new Error('Not good player to play');
        }
    }

    isWinner(p: Player){
        if(!p || !this.getWinner()){
            throw Error('no winner to compare')
        }
        return this.getWinner().socketid === p.socketid
    }

    getWinner(): Player { 
        let res: Player = this.arrPlay[0] && this.arrPlay[0].player;
        let maxValueCard:number = -1;

        this.arrPlay.forEach( (play: Play) => {
            if(play.card.value > maxValueCard){
                maxValueCard = play.card.value;
                res = play.player;
            }
        });

        return res as Player;
    }

    playerAlreadyPlayed(p: Player){
        let res:boolean = false;
        this.arrPlay.forEach( (play: Play) => {
            if(p.isEqual(play.player)){
                res = true;
            }
        })
        return res;
    }

    // TODO
    isPlayerToPlay(p: Player){
        return true
    }

    getListOfPlayerHavingPlayed(){
        return this.players.filter( (p: Player) => { return this.playerAlreadyPlayed(p) } )
    }

    allPlayerHavePlayed(){
        return this.getListOfPlayerHavingPlayed().length === this.players.length
    }

}