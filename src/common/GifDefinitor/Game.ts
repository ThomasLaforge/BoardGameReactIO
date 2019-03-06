import {Gif} from './Gif'
import {Turn} from './Turn'
import {Player} from './Player'
import fetch from 'node-fetch';
import { WinCondition, WinConditionType } from './GifDefinitor';

export class Game {

    public gifApiKey: string
    public players: Player[]
    public turn?: Turn
    public history: Turn[]
    public winCondition: WinCondition | undefined

    constructor(players: Player[], gifAPiKey = 'wrxBKkmJ1o4LqGeNg7TueyumUzagodPR', wincondition?: WinCondition){
        this.gifApiKey = gifAPiKey
        this.players = players
        this.history = []
        this.winCondition = wincondition
    }

    async startGame(){
        return this.startTurn()
    }

    async startTurn(){
        const [gif, scrumbler] = await Promise.all( [this.getRandomGif(), this.generateScrumbler() ])
        this.turn = new Turn(this.players, gif, scrumbler)
    }
    async nextTurn(){
        if(this.turn){
            this.history = this.history.concat(this.turn)
            await this.startTurn()
        }
        else {
            throw Error('Try to finish a turn but turn doesnt exist')
        }
    }

    async generateScrumbler(){
        return this.players.map( (p, i) => i).sort( () => .5 - Math.random()) }
    
    async getRandomGif(){
        let gifUrl: string;

        try {
            let gifData = await fetch('https://api.giphy.com/v1/gifs/random?api_key=' + this.gifApiKey + '&rating=r')
            let gifDataJson = await gifData.json()
            gifUrl = gifDataJson.data.images.original.url
        }
        catch(e){
            console.error('error on getting gif', e)
            gifUrl = 'default_gif_url'
        }
        
        return new Gif(gifUrl)
    }

    getScore(p: Player){
        return this.history.reduce( (score, turn) => score + (turn.isWinner(p) ? 1 : 0) , 0)
    }

    getMaxScore(){
        return this.players.reduce( (maxScore, p) => Math.max(maxScore, this.getScore(p)) , 0)
    }

    getWinners(){
        let max = 0
        let winners: Player[] = []

        this.players.forEach( (p) => {
            let score = this.getScore(p)
            if(score >= max){
                max = score
                
                if(score > max){
                    winners = []
                }

                winners.push(p)
            }
        })

        return winners
    }

    isGameOver(){
        let gameOver = false
        if( this.winCondition && 
            (
                (this.winCondition.type === WinConditionType.nb_point && this.getMaxScore() >= this.winCondition.value)
            ||  (this.winCondition.type === WinConditionType.nb_turn && this.history.length >= this.winCondition.value)
            )
        ){
            gameOver = true
        }
        return gameOver
    }

    get currentGif(){
        return this.turn && this.turn.gif
    }

    getPlayerIndex(player: Player){
        return this.players.findIndex(p => p.isEqual(player))
    }

    getPlayer(socketId: string){
        return this.players.find(p => p.socketid === socketId) as Player
    }
}