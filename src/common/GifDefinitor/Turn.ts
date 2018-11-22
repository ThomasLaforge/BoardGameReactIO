import { Gif } from './Gif'
import { Player } from './Player';
import { Proposition, Vote } from './GifDefinitor';

export class Turn {

    public players: Player[]
    public gif: Gif
    public votes: Vote[]
    public propositions: Proposition[]
    public scrumbler?: number[]

    constructor(players: Player[], gif: Gif, scrumbler?: number[]){
        this.players = players
        this.gif = gif
        this.votes = []
        this.propositions = []
        this.scrumbler = scrumbler
    }
    
    addProposition(prop: Proposition) {
        const propIndex = this.propositions.findIndex(p => p.player.isEqual(prop.player))
        if(propIndex === -1){
            this.propositions = this.propositions.concat(prop)
        }
        else {
            this.propositions[propIndex] = prop
        }
    }
    
    allPlayersAnswered(){
        return this.nbPlayers === this.propositions.length
    }

    addVote(vote: Vote){
        const voteIndex = this.votes.findIndex(v => v.voter.isEqual(vote.voter))
        if(voteIndex === -1){
            this.votes = this.votes.concat(vote)
        }
        else {
            this.votes[voteIndex] = vote
        }
    }

    allPlayerVoted(){
        return this.votes.length === this.nbPlayers
    }

    get nbPlayers(){
        return this.players.length
    }

    getVoteResults(){
        // return for each player nb times people vote for his proposition
        return this.players.map(p =>
            // get nb times people vote for p
            this.votes.filter(v => {
                let propositionOfVote = this.propositions[v.propositionIndex]
                return propositionOfVote.player.isEqual(p)
            }).length
        )
    }

    getWinners(){
        let max = 0
        let winners: Player[] = []

        this.getVoteResults().forEach( (nbVote, k) => {
            if(nbVote >= max){
                max = nbVote
                
                if(nbVote > max){
                    winners = []
                }

                winners.push(this.players[k])
            }
        })

        return winners
    }

    isWinner(p: Player){
        return this.getWinners().filter( (winner: Player) => winner.isEqual(p)).length
    }

    hasAnswered(p: Player){
        return this.propositions.filter(prop => prop.player.isEqual(p)).length === 1
    }

    hasVoted(p: Player){
        return this.votes.filter(v => v.voter.isEqual(p)).length === 1
    }

}