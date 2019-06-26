// import { serialize, deserialize } from 'serializr'

import { SuperSocket } from '../SuperSocket';

import {prefix, NB_PLAYER, DELAY_AFTER_RESET} from '../../common/Flip/defs'
import { MultiplayerGame } from '../../common/modules/MultiplayerGame';
import { Game as FlipGame } from '../../common/Flip/Game'
import { serialize } from 'serializr';
import { GameCollection, SocketPlayer } from '../../common';
import { Player } from '../../common/Flip/Player';
import { Game } from '../../common/modules/Game';

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
        console.log('game:add-card', cardIndex, stackIndex);
        let game = GC.getGameWithUser(socket.id)
        let flipGame = game && game.gameInstance as FlipGame | undefined
        if(flipGame) {
            let p = flipGame.getPlayer(socket.id)
            if(p){
                flipGame.putCard(p, cardIndex, stackIndex)
                updateUI(socket, game as MultiplayerGame)
                if(flipGame.cantAddCards()){
                    console.log('cant add cards !')
                    flipGame.resetDecks()
                    setTimeout(() => {
                        updateUI(socket, game as MultiplayerGame)
                    }, DELAY_AFTER_RESET)
                }
            }
            else {
                console.error('unknown player call stress', socket.id, (game as Game).id)
            }
        }
    })

    socket.on(prefix + 'game:stress', () => {
        let game = GC.getGameWithUser(socket.id)
        let flipGame = game && game.gameInstance as FlipGame | undefined
        console.log('game:stress');
        if(flipGame) {
            let p = flipGame.getPlayer(socket.id)
            if(p){
                console.log('game:stress in');
                flipGame.callStress(p)
                updateUI(socket, game as MultiplayerGame)
            }
            else {
                console.error('unknown player call stress', socket.id, (game as Game).id)
            }
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
            flipGame.isGameOver(),
            flipGame.canAddCards()
        ]
        
        flipGame.players.forEach( p => {
            let playerSpecificsParams = params.slice()
            playerSpecificsParams.push(
                p.getPlayableCards(),
                flipGame.getOpponent(p).getPlayableCards(),
                flipGame.stacks.map(s =>  serialize(s.topCard))
            )

            socket.server.to(p.socketid).emit(prefix + 'game:players.update', ...playerSpecificsParams)
        })
        sendGameInfos(socket, game)
    }
}