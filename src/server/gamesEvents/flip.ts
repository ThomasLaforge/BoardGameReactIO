// import { serialize, deserialize } from 'serializr'

import { SuperSocket } from '../SuperSocket';

import {prefix} from '../../common/Flip/defs'
import { MultiplayerGame } from '../../common/modules/MultiplayerGame';
import { Game as FlipGame } from '../../common/Flip/Game'
import { serialize } from 'serializr';
import { GameCollection } from '../../common';

export const addSetEvents = (socket: SuperSocket, GC: GameCollection) => {

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

    socket.on(prefix + 'game:play', (cards: any[]) => {
        let game = GC.getGameWithUser(socket.id)
        let flipGame = game && game.gameInstance as FlipGame | undefined
        let p = flipGame && flipGame.players.find(p => p.socketid === socket.socketPlayer.socketid)
        console.log('cards', cards, game && flipGame && p)
        if(game && flipGame && p){
            // const isValid = flipGame.tryToAddPlay(p, cards)
            // if(isValid){
                // const lastPlay = flipGame.getLastPlay()
                // socket.server.in(game.id).emit(prefix + 'game:new_play', serialize(lastPlay.combination), socket.id);
                // setTimeout(() => { 
                //     (flipGame as flipGame).resetTurn()
                //     updateUI(socket, game as MultiplayerGame) }, 
                //     NEXT_TURN_DELAY
                // )
            // }
            // else {
                // updateUI(socket, game)
            // } 
        }
    })

    socket.on(prefix + 'game:add-cards', () => {
        let game = GC.getGameWithUser(socket.id)
        let flipGame = game && game.gameInstance as FlipGame | undefined
        if(flipGame) {
            // flipGame.nextTurn(true)
            updateUI(socket, game as MultiplayerGame)
        }

    })
}

function sendGameInfos(socket: SuperSocket, game: MultiplayerGame, initialCall = false){
    let flipGame = game.gameInstance as FlipGame | undefined
    let players: any = flipGame ? flipGame.players : game.players
    
    const uiPlayers = players.map( (p: any) => (
        {
            name: flipGame ? p.username : p.surname,
            socketid: p.socketid,
            // score: flipGame ? flipGame.getPlayerScore(p) : 0,
            // hasError: flipGame && flipGame.playerHasAnError(p)
        }
    ))

    // console.log('game:player.ask_initial_infos', game.id, uiPlayers, game.isFirstPlayer(socket.id), initialChat)
    socket.emit(prefix + 'game:player.ask_initial_infos', game.id, uiPlayers, game.isFirstPlayer(socket.socketPlayer.socketid), nbPlayer)
    socket.baseSocket.to(game.id).broadcast.emit(prefix + 'game:players.new_player', uiPlayers)
}

function updateUI(socket: SuperSocket, game: MultiplayerGame){
    let flipGame = game.gameInstance as FlipGame
    if(flipGame){
        // console.log('updateUI', flipGame)
        let params: any[] = [
            flipGame.isGameOver()
        ]

        flipGame.players.forEach( p => {
            let playerSpecificsParams = params.slice()
            // playerSpecificsParams.push(
                // flipGame.playerHasAnError(p)
            // )

            socket.server.to(p.socketid).emit(prefix + 'game:players.update', ...playerSpecificsParams)
        })
        sendGameInfos(socket, game)
    }
}