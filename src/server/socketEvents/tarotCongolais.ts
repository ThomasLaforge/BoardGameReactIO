import { serialize, deserialize } from 'serializr'

import { SuperSocket } from '../SuperSocket';
import {SocketIoDescriptor} from '../SocketIoDescriptor'
import { 
    GameCollection, 
    LimiteLimiteGame, 
    PropositionCard,
    NB_SECONDS_BEFORE_NEXT_TURN
} from '../../common';

export const addTarotCongolaisEvents = (socket: SuperSocket, GC: GameCollection) => {
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