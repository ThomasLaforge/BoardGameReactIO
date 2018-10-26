import { serialize, deserialize } from 'serializr'

import { SuperSocket } from '../SuperSocket';
import {SocketIoDescriptor} from '../SocketIoDescriptor'
import { 
    GameCollection, Hand, 
} from '../../common';

import {prefix, DEFAULT_START_PV} from '../../common/TarotCongolais/TarotCongolais'
import { MultiplayerGame } from '../../common/modules/MultiplayerGame';
import { Game as TarotCongolaisGame } from '../../common/TarotCongolais/Game'

export const addTarotCongolaisEvents = (socket: SuperSocket, GC: GameCollection) => {

    socket.on(prefix + 'game:ask_initial_infos', () => {
        let game = GC.getGameWithUser(socket.id)
        if(game){
            // let initialChat: ChatMessage[] = []
            sendGameInfos(socket, game, true)
        }
    })

    socket.on(prefix + 'game:start', () => {
        let game = GC.getGameWithUser(socket.id)
        if(game){
            game.start()
            let tcgame = game.gameInstance as TarotCongolaisGame
            tcgame.start()
            
            let hand = new Hand()
            // socket.server.to(`${tcgame.getMainPlayerSocketId()}`).emit(prefix + 'game:mp.start', hand)
            // tcgame.getPropsPlayersSocketIds().forEach( (socketId: string) => {
            //     const p = (tcgame as TarotCongolaisGame).getPlayer(socketId)
            //     const hand = p && serialize(p.hand)
            //     socket.server.to(`${socketId}`).emit(prefix + 'game:op.start', sentence, hand)
            // })

            // sendGameInfos(socket, game)
            // sendBetInfos(socket, game)
        }
    })

    socket.on('player_bet', (playerBet: number) => {
        console.log('player_bet', playerBet)
        // let g = GC.getGame(socket.gameRoomId);
        // if(g){
        //     try {
        //         g.addBet( new Bet(socket.player, playerBet) )
        //         updateUI(socket)                
        //     } catch (error) {
        //         console.log('player already bet')
        //     }
        // }
    })

    socket.on('player_play', (cardValue: number) => {
        // let card = new Card(cardValue)
        console.log('player_play', cardValue)
        // let g = GC.getGame(socket.gameRoomId);
        // if(g){
        //     try {
        //         g.addPlay( new Play(socket.player, card) )
        //         updateUI(socket)
        //     } catch (error) {
        //         console.log('player already played')
        //     }            
        // }
    })
}

function sendGameInfos(socket: SuperSocket, game: MultiplayerGame, initialCall = false){
    let tcgame = game.gameInstance as TarotCongolaisGame | undefined
    let players: any = tcgame ? tcgame.players : game.players
    const uiPlayers = players.map( (p: any) => {
        return {
            name: tcgame ? p.username : p.surname,
            pv: tcgame ? p.pv : DEFAULT_START_PV,
            bet: tcgame ? tcgame.getBet(p) : 0,
            nbTricks: tcgame ? tcgame.getNbWonTrick(p) : 0
        }
    })
    // console.log('game:player.ask_initial_infos', game.id, uiPlayers, game.isFirstPlayer(socket.id), initialChat)
    socket.emit(prefix + 'game:player.ask_initial_infos', game.id, uiPlayers, game.isFirstPlayer(socket.getOrCreatePlayer().socketid))
    socket.baseSocket.to(game.id).broadcast.emit(prefix + 'game:players.new_player', uiPlayers)
}

function newTurn(socket: SuperSocket, game: MultiplayerGame){

    sendGameInfos(socket, game)
}