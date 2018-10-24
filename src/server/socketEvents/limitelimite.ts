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
            let llgame = game.gameInstance
            llgame.startGame()
            const sentence = serialize(llgame.currentSentenceCard)
            
            socket.server.to(`${llgame.getMainPlayerSocketId()}`).emit('game:mp.start', sentence)
            llgame.getPropsPlayersSocketIds().forEach( (socketId: string) => {
                const p = (llgame as LimiteLimiteGame).getPlayer(socketId)
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
            let llgame = game.gameInstance as LimiteLimiteGame
            let propositionCards = deserialize(PropositionCard, propositionCardJSON)
            console.log('after send prop', propositionCardJSON, propositionCards, llgame.propsSent, llgame.canResolveTurn());
            llgame.sendProp(propositionCards, socket.getOrCreatePlayer())
            
            if(llgame.canResolveTurn()){
                socket.server.in(game.id).emit('game:players.turn_to_resolve', llgame.propsSent.map(p => p.prop))
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
            let llgame = game.gameInstance
            llgame.endTurn(propositionCardIndex)            
            let winnerPlayerSocketId = llgame.getMainPlayerSocketId()
            let winnerPlayerName = llgame.getPlayer(winnerPlayerSocketId).surname 
            socket.server.in(game.id).emit('game:players.turn_is_complete', propositionCardIndex, winnerPlayerName)

            setTimeout( () => {
                llgame = llgame as LimiteLimiteGame
                const sentence = serialize(llgame.currentSentenceCard)
                console.log(llgame.getMainPlayerSocketId(), llgame.getPropsPlayersSocketIds());
                socket.server.to(`${llgame.getMainPlayerSocketId()}`).emit('game:mp.new_turn', sentence)
                llgame.getPropsPlayersSocketIds().forEach( (socketId: string) => {
                    const p = (llgame as LimiteLimiteGame).getPlayer(socketId)
                    const hand = p && serialize(p.hand)
                    socket.server.to(`${socketId}`).emit('game:op.new_turn', sentence, hand)
                })
                socket.sendGameInfos(llgame)
            }, NB_SECONDS_BEFORE_NEXT_TURN  * 1000)
        }
    })
}