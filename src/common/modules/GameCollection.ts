import { GameLobbyList, GameLobbyListElt } from '../UI'
import { Game } from './Game';
import { GameTypeClass } from '..';
import { MultiplayerGame } from './MultiplayerGame';

export class GameCollection {

    public games: GameTypeClass[]

    constructor(games: GameTypeClass[] = []){
        this.games = games
    }

    addGame(game: GameTypeClass){
        this.games.push(game)
    }

    getGame(gameRoomId:string){
        return this.games.find(g => g.id === gameRoomId) as Game
    }

    getRandomAndNotFullGameRoomId(gameName: string){
        let game = this.multiplayerGames.find(g => !g.isFull && g.type === gameName)
        // console.log('game id', this.multiplayerGames, this.multiplayerGames.find(g => !g.isFull), this.multiplayerGames.find(g => g.type === gameType), game, game && game.id)
        return game && game.id
    }

    getGameWithUser(socketId: string){
        // console.log('getGameWithUser', socketId)
        return this.multiplayerGames.find(g => {
            // console.log('game players', g.players)
            return g.players.filter(p => p.socketid === socketId).length === 1
        })
    }

    removeGame(gameId: string){
        this.games = this.games.filter(g => g.id !== gameId)
    }

    getLobbyList( withFullGames = false, withPrivateGames = false ): GameLobbyList {
        return this.multiplayerGames
            .filter(g => (withFullGames || !g.isFull) && (withPrivateGames || !g.isPrivate) )
            .map(game => ({
                gameId: game.id,
                people: game.playersNames,
                isFull: game.isFull,
                gameType: game.type,
                nbPlayer: game.nbPlayer,
                creationDate: game.creationDate
            } as GameLobbyListElt))
    }

    get multiplayerGames(): MultiplayerGame[] {
        // console.log('multiplayer games', this.games.filter( g => g instanceof MultiplayerGame))
        return this.games.filter( g => g instanceof MultiplayerGame) as MultiplayerGame[] 
    }
    
}