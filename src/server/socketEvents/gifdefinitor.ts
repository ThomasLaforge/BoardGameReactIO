import { serialize, deserialize } from 'serializr'

import { SuperSocket } from '../SuperSocket';
import { GameCollection } from '../../common';
import { MultiplayerGame } from '../../common/modules/MultiplayerGame';

import { Game as GifDefinitorGame } from '../../common/GifDefinitor/Game'
import { prefix, NB_SECONDS_BEFORE_NEXT_TURN } from '../../common/GifDefinitor/GifDefinitor'

export const addLimiteLimiteEvents = (socket: SuperSocket, GC: GameCollection) => {
    socket.on(prefix + 'game:ask_initial_infos', () => {
        let game = GC.getGameWithUser(socket.id)
        if(game){
            sendGameInfos(socket, game)
        }
    })
    
    socket.on(prefix + 'game:start', async () => {
        let game = GC.getGameWithUser(socket.id)
        if(game){
            game.start()
            let gd = game.gameInstance as GifDefinitorGame
            await gd.startGame()
            const gif = serialize(gd.currentGif)

            sendGameInfos(socket, game)
        }
    })

    socket.on(prefix + 'game:send_prop', (proposition: string) => {
        let game = GC.getGameWithUser(socket.id)
        if(game){
            // game
            let gd = game.gameInstance as GifDefinitorGame
            gd.turn.addProposition({
                player: socket.getOrCreatePlayer(), 
                sentence: proposition
            })
            
            if(gd.turn.allPlayersAnswered()){
                socket.server.in(game.id).emit(prefix + 'game:players.time_to_vote', gd.turn.propositions.map(p => p.sentence))
            }
            else {
                socket.emit(prefix + 'game:player.player_has_played')
            }

            sendGameInfos(socket, game)
        }
    })

    socket.on(prefix + 'game:send_vote', (propositionIndex: number) => {
        let game = GC.getGameWithUser(socket.id)
        if(game){
            // game
            let gd = game.gameInstance as GifDefinitorGame
            gd.turn.addVote({
                voter: socket.getOrCreatePlayer(), 
                propositionIndex: propositionIndex
            })
            
            if(gd.turn.allPlayerVoted()){
                socket.server.in(game.id).emit(prefix + 'game:players.results_ready', gd.turn.votes.map(v => v.))
            }
            else {
                socket.emit(prefix + 'game:player.player_has_played')
            }

            sendGameInfos(socket, game)
        }
    })

    socket.on(prefix + 'game:get_results', (propositionCardIndex: number) => {
        let game = GC.getGameWithUser(socket.id)
        console.log('socket end turn:', !!game, propositionCardIndex)
        if(game){
            let gd = game.gameInstance as GifDefinitorGame
            let winners = gd.turn.getWinners()
            gd.endTurn()
            let winnerPlayerName = gd.getPlayer(winnerPlayerSocketId).surname 
            socket.server.in(game.id).emit(prefix + 'game:players.turn_is_complete', propositionCardIndex, winnerPlayerName)

            setTimeout( () => {
                gd = gd as GifDefinitorGame
                const sentence = serialize(gd.currentSentenceCard)
                console.log(gd.getMainPlayerSocketId(), gd.getPropsPlayersSocketIds());
                socket.server.to(`${gd.getMainPlayerSocketId()}`).emit(prefix + 'game:mp.new_turn', sentence)
                gd.getPropsPlayersSocketIds().forEach( (socketId: string) => {
                    const p = (gd as GifDefinitorGame).getPlayer(socketId)
                    const hand = p && serialize(p.hand)
                    socket.server.to(`${socketId}`).emit(prefix + 'game:op.new_turn', sentence, hand)
                })
                sendGameInfos(socket, gd)
            }, NB_SECONDS_BEFORE_NEXT_TURN  * 1000)
        }
    })

}

function sendGameInfos(socket: SuperSocket, game: MultiplayerGame){
    let gd = game.gameInstance as GifDefinitorGame
    const playersToShow: any[] = gd ? gd.players : game.players
    const uiPlayers = playersToShow.map( (p) => {
        const hasPlayedOrVoted = gd && (
                (!gd.turn.allPlayersAnswered() && gd.turn.hasAnswered(p) ) 
            ||  (gd.turn.allPlayersAnswered() && gd.turn.hasVoted(p))
        )
        return {
            name: p.surname,
            score: gd ? gd.getScore(p) : 0,
            hasPlayedOrVoted
        }
    })
    // console.log('game:player.ask_initial_infos', game.id, uiPlayers, game.isFirstPlayer(socket.id), initialChat)
    let myIndex = gd? gd.getPlayerIndex(gd.getPlayer(socket.id)) : game.getPlayerIndex(game.getPlayer(socket.id))
    console.log('prefix on super socket', prefix)
    socket.emit(prefix + 'game:player.ask_initial_infos', game.id, uiPlayers, gd ? gd.isFirstPlayer(socket.id) : game.isFirstPlayer(socket.id), myIndex)
    socket.baseSocket.to(game.id).broadcast.emit(prefix + 'game:players.new_player', uiPlayers)
}