import { serialize, deserialize } from 'serializr'

import { SuperSocket } from '../SuperSocket';
import {SocketIoDescriptor} from '../SocketIoDescriptor'
import { 
    GameCollection, 
    LimiteLimiteGame, 
    PropositionCard,
    NB_SECONDS_BEFORE_NEXT_TURN
} from '../../common';

export const addLimiteLimiteEvents = (socket: SuperSocket, GC: GameCollection) => {
    socket.on('game:ask_initial_infos', () => {
        let game = GC.getGameWithUser(socket.id)
        if(game){
            // let initialChat: ChatMessage[] = []
            socket.sendGameInfos(game)
        }
    })
    
    socket.on('game:start', () => {
        let game = GC.getGameWithUser(socket.id)
        if(game){
            game.startGame()
            const sentence = serialize(game.currentSentenceCard)
            
            socket.server.to(`${game.getMainPlayerSocketId()}`).emit('game:mp.start', sentence)
            game.getPropsPlayersSocketIds().forEach(socketId => {
                const p = (game as LimiteLimiteGame).getPlayer(socketId)
                const hand = p && serialize(p.hand)
                socket.server.to(`${socketId}`).emit('game:op.start', sentence, hand)
            })

            socket.sendGameInfos(game)
        }
    })

    socket.on('game:send_prop', (propositionCardJSON: any[]) => {
        let game = GC.getGameWithUser(socket.id)
        if(game){
            // game
            let propositionCards = deserialize(PropositionCard, propositionCardJSON)
            console.log('after send prop', propositionCardJSON, propositionCards, game.propsSent, game.canResolveTurn());
            game.sendProp(propositionCards, socket.getOrCreatePlayer())
            
            if(game.canResolveTurn()){
                socket.server.in(game.id).emit('game:players.turn_to_resolve', game.propsSent.map(p => p.prop))
            }
            else {
                socket.emit('game:player.player_has_played')
            }

            socket.sendGameInfos(game)
        }
    })

    socket.on('game:end_turn', (propositionCardIndex: number) => {
        let game = GC.getGameWithUser(socket.id)
        console.log('socket end turn:', !!game, propositionCardIndex)
        if(game){
            game.endTurn(propositionCardIndex)            
            let winnerPlayerSocketId = game.getMainPlayerSocketId()
            let winnerPlayerName = game.getPlayer(winnerPlayerSocketId).surname 
            socket.server.in(game.id).emit('game:players.turn_is_complete', propositionCardIndex, winnerPlayerName)

            setTimeout( () => {
                game = game as LimiteLimiteGame
                const sentence = serialize(game.currentSentenceCard)
                console.log(game.getMainPlayerSocketId(), game.getPropsPlayersSocketIds());
                socket.server.to(`${game.getMainPlayerSocketId()}`).emit('game:mp.new_turn', sentence)
                game.getPropsPlayersSocketIds().forEach(socketId => {
                    const p = (game as LimiteLimiteGame).getPlayer(socketId)
                    const hand = p && serialize(p.hand)
                    socket.server.to(`${socketId}`).emit('game:op.new_turn', sentence, hand)
                })
                socket.sendGameInfos(game)
            }, NB_SECONDS_BEFORE_NEXT_TURN  * 1000)
        }
    })
}