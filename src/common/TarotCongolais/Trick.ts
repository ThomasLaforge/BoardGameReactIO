import { Player } from './Player';
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
        this.arrPlay.push(play);
        return this.getWinner()
    }

    isWinner(p: Player){
        if(!this.getWinner()){
            throw Error('no winner to compare')
        }
        else {
            return this.isComplete() && (this.getWinner() as Player).socketid === p.socketid
        }
    }

    getWinner(): Player | null{
        if(this.isComplete()){
            let res: Player = this.arrPlay[0] && this.arrPlay[0].player;
            let maxValueCard:number = -1;

            this.arrPlay.forEach( (play: Play) => {
                if(play.card.value > maxValueCard){
                    maxValueCard = play.card.value;
                    res = play.player;
                }
            });

            return res as Player
        }
        else {
            return null
        }
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

    getListOfPlayerHavingPlayed(){
        return this.players.filter( (p: Player) => { return this.playerAlreadyPlayed(p) } )
    }

    allPlayerHavePlayed(){
        return this.getListOfPlayerHavingPlayed().length === this.players.length
    }

    isComplete(){
        return this.arrPlay.length === this.players.length
    }    

}