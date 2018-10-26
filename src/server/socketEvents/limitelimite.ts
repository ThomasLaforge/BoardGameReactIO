import { serialize, deserialize } from 'serializr'

import { SuperSocket } from '../SuperSocket';
import {SocketIoDescriptor} from '../SocketIoDescriptor'
import { 
    GameCollection, 
    LimiteLimiteGame, 
    PropositionCard,
    NB_SECONDS_BEFORE_NEXT_TURN,
    PlayerListUI,
    PlayerListUIElt
} from '../../common';
import { prefix } from '../../common/LimiteLimite'
import { MultiplayerGame } from '../../common/modules/MultiplayerGame';

console.log('prefix on limitelimite events', prefix)

export const addLimiteLimiteEvents = (socket: SuperSocket, GC: GameCollection) => {
    socket.on(prefix + 'game:ask_initial_infos', () => {
        let game = GC.getGameWithUser(socket.id)
        if(game){
            // let initialChat: ChatMessage[] = []
            sendGameInfos(socket, game)
        }
    })
    
    socket.on(prefix + 'game:start', () => {
        let game = GC.getGameWithUser(socket.id)
        if(game){
            game.start()
            let llgame = game.gameInstance as LimiteLimiteGame
            llgame.startGame()
            const sentence = serialize(llgame.currentSentenceCard)
            
            socket.server.to(`${llgame.getMainPlayerSocketId()}`).emit(prefix + 'game:mp.start', sentence)
            llgame.getPropsPlayersSocketIds().forEach( (socketId: string) => {
                const p = (llgame as LimiteLimiteGame).getPlayer(socketId)
                const hand = p && serialize(p.hand)
                socket.server.to(`${socketId}`).emit(prefix + 'game:op.start', sentence, hand)
            })

            sendGameInfos(socket, game)
        }
    })

    socket.on(prefix + 'game:send_prop', (propositionCardJSON: any[]) => {
        let game = GC.getGameWithUser(socket.id)
        if(game){
            // game
            let llgame = game.gameInstance as LimiteLimiteGame
            let propositionCards = deserialize(PropositionCard, propositionCardJSON)
            console.log('after send prop', propositionCardJSON, propositionCards, llgame.propsSent, llgame.canResolveTurn());
            llgame.sendProp(propositionCards, socket.getOrCreatePlayer())
            
            if(llgame.canResolveTurn()){
                socket.server.in(game.id).emit(prefix + 'game:players.turn_to_resolve', llgame.propsSent.map(p => p.prop))
            }
            else {
                socket.emit(prefix + 'game:player.player_has_played')
            }

            sendGameInfos(socket, game)
        }
    })

    socket.on(prefix + 'game:end_turn', (propositionCardIndex: number) => {
        let game = GC.getGameWithUser(socket.id)
        console.log('socket end turn:', !!game, propositionCardIndex)
        if(game){
            let llgame = game.gameInstance
            llgame.endTurn(propositionCardIndex)            
            let winnerPlayerSocketId = llgame.getMainPlayerSocketId()
            let winnerPlayerName = llgame.getPlayer(winnerPlayerSocketId).surname 
            socket.server.in(game.id).emit(prefix + 'game:players.turn_is_complete', propositionCardIndex, winnerPlayerName)

            setTimeout( () => {
                llgame = llgame as LimiteLimiteGame
                const sentence = serialize(llgame.currentSentenceCard)
                console.log(llgame.getMainPlayerSocketId(), llgame.getPropsPlayersSocketIds());
                socket.server.to(`${llgame.getMainPlayerSocketId()}`).emit(prefix + 'game:mp.new_turn', sentence)
                llgame.getPropsPlayersSocketIds().forEach( (socketId: string) => {
                    const p = (llgame as LimiteLimiteGame).getPlayer(socketId)
                    const hand = p && serialize(p.hand)
                    socket.server.to(`${socketId}`).emit(prefix + 'game:op.new_turn', sentence, hand)
                })
                sendGameInfos(socket, llgame)
            }, NB_SECONDS_BEFORE_NEXT_TURN  * 1000)
        }
    })

}

function sendGameInfos(socket: SuperSocket, game: MultiplayerGame){
    let llgame = game.gameInstance as LimiteLimiteGame
    const uiPlayers: PlayerListUI = llgame.players.map(p => {
        let isFirstPlayer = llgame ? llgame.isFirstPlayer(p.socketid) : game.isFirstPlayer(p.socketid)
        return {
            name: p.surname,
            score: p.score,
            isFirstPlayer,
            hasPlayed: llgame && !isFirstPlayer && llgame.playerHasPlayed(p)
        } as PlayerListUIElt
    })
    // console.log('game:player.ask_initial_infos', game.id, uiPlayers, game.isFirstPlayer(socket.id), initialChat)
    let myIndex = llgame? llgame.getPlayerIndex(llgame.getPlayer(socket.id)) : game.getPlayerIndex(game.getPlayer(socket.id))
    console.log('prefix on super socket', prefix)
    socket.emit(prefix + 'game:player.ask_initial_infos', game.id, uiPlayers, llgame ? llgame.isFirstPlayer(socket.id) : game.isFirstPlayer(socket.id), myIndex)
    socket.baseSocket.to(game.id).broadcast.emit(prefix + 'game:players.new_player', uiPlayers)
}