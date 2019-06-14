// import { serialize, deserialize } from 'serializr'

import { SuperSocket } from '../SuperSocket';

import {prefix, NB_PLAYER} from '../../common/Flip/defs'
import { MultiplayerGame } from '../../common/modules/MultiplayerGame';
import { Game as FlipGame } from '../../common/Flip/Game'
import { serialize } from 'serializr';
import { GameCollection, SocketPlayer } from '../../common';
import { Player } from '../../common/Flip/Player';

export const addFlipEvents = (socket: SuperSocket, GC: GameCollection) => {

    socket.on(prefix + 'game:ask_initial_infos', () => {
        let game = GC.getGameWithUser(socket.id)
        if(game){
            sendGameInfos(socket, game, true)
        }
    })

    socket.on(prefix + 'game:start', () => {
        let game = GC.getGameWithUser(socket.id)
        if(game){
            game.start()
            updateUI(socket, game)
        }
    })

    socket.on(prefix + 'game:add-card', (cardIndex: number, stackIndex: number) => {
        let game = GC.getGameWithUser(socket.id)
        let flipGame = game && game.gameInstance as FlipGame | undefined
        if(flipGame) {
            updateUI(socket, game as MultiplayerGame)
        }
    })

    socket.on(prefix + 'game:stress', () => {
        let game = GC.getGameWithUser(socket.id)
        let flipGame = game && game.gameInstance as FlipGame | undefined
        if(flipGame) {
            updateUI(socket, game as MultiplayerGame)
        }
    })
}

function sendGameInfos(socket: SuperSocket, game: MultiplayerGame, initialCall = false){
    let flipGame = game.gameInstance as FlipGame | undefined
    let players: any = flipGame ? flipGame.players : game.players
    
    const uiPlayers = players.map( (p: Player | SocketPlayer) => {
        if(flipGame){
            p = p as Player
            return {
                name: p.username,
                socketid: p.socketid,
                nbCards: p.deck && p.deck.length
            }
        }
        else {
            p = p as SocketPlayer
            return {
                name: p.surname,
                socketid: p.socketid,
                nbCards: null
            }
        }
    })

    // console.log('game:player.ask_initial_infos', game.id, uiPlayers, game.isFirstPlayer(socket.id), initialChat)
    socket.emit(prefix + 'game:player.ask_initial_infos', game.id, uiPlayers, game.isFirstPlayer(socket.socketPlayer.socketid), NB_PLAYER)
    socket.baseSocket.to(game.id).broadcast.emit(prefix + 'game:players.new_player', uiPlayers)
}

function updateUI(socket: SuperSocket, game: MultiplayerGame){
    let flipGame = game.gameInstance as FlipGame
    if(flipGame){
        let params: any[] = [
            flipGame.isGameOver()
        ]

        flipGame.players.forEach( p => {
            console.log('flip player', p)
            let playerSpecificsParams = params.slice()
            playerSpecificsParams.push(
                p.getPlayableCards(),
                flipGame.getOpponent(p).getPlayableCards(),
                flipGame.stacks.map(s =>  s.topCard && s.topCard.value )
            )

            socket.server.to(p.socketid).emit(prefix + 'game:players.update', ...playerSpecificsParams)
        })
        sendGameInfos(socket, game)
    }
}