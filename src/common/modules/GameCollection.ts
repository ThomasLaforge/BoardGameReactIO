import { LimiteLimiteGame } from './LimiteLimiteGame'
import { GameLobbyList, DEFAULT_IS_PRIVATE_GAME } from '../LimiteLimite'
import { Player } from './Player';

export class Game {
    public gameConstructor: any
    public game: LimiteLimiteGame | null
    public isPrivate: boolean
    public id: string
    public nbPlayer: number
    public players: Player[]
    private _forcedIsFull: boolean


    constructor(gameConstructor: any, nbPlayer: number, isPrivate = DEFAULT_IS_PRIVATE_GAME){
        this.gameConstructor = gameConstructor
        this.game = null
        this.isPrivate = isPrivate
        this.id = Date.now().toString()
        this.nbPlayer = nbPlayer
        this.players = []
    }

    get isFull(){
        return this._forcedIsFull || this.nbPlayer === this.players.length
    }
    
    addPlayer(p: Player){
        this.players.push(p)
    }

    removePlayer(socketId: string){
        this.players = this.players.filter(p => p.socketid !== socketId)
    }

}

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