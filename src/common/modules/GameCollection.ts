import { GameLobbyList } from '../LimiteLimite'
import { Game } from './Game';

export class GameCollection {

    public games: Game[]

    constructor(games: Game[] = []){
        this.games = games
    }

    addGame(game: Game){
        this.games.push(game)
    }

    getGame(gameRoomId:string){
        return this.games.find(g => g.id === gameRoomId)
    }

    getRandomAndNotFullGameRoomId(){
        let game = this.games.find(g => !g.isFull)
        return game && game.id
    }

    getGameWithUser(socketId: string){
        // console.log('getGameWithUser', socketId)
        return this.games.find(g => {
            // console.log('game players', g.players)
            return g.players.filter(p => p.socketid === socketId).length === 1
        })
    }

    removeGame(gameId: string){
        this.games = this.games.filter(g => g.id !== gameId)
    }

    getLobbyList( withFullGames = false, withPrivateGames = false ): GameLobbyList {
        return this.games
            .filter(g => (withFullGames || !g.isFull) && (withPrivateGames || !g.isPrivate) )
            .map(game => ({
                gameId: game.id,
                people: game.playersNames,
                isFull: game.isFull
            }))
    }
    
}