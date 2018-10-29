// import { serialize, deserialize } from 'serializr'

import { SuperSocket } from '../SuperSocket';
import {SocketIoDescriptor} from '../SocketIoDescriptor'
import { 
    GameCollection, Hand, 
} from '../../common';

import {prefix, DEFAULT_START_PV} from '../../common/TarotCongolais/TarotCongolais'
import { MultiplayerGame } from '../../common/modules/MultiplayerGame';
import { Game as TarotCongolaisGame } from '../../common/TarotCongolais/Game'
import { Card } from '../../common/TarotCongolais/Card';

export const addTarotCongolaisEvents = (socket: SuperSocket, GC: GameCollection) => {

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
            let tcgame = game.gameInstance as TarotCongolaisGame
            tcgame.start()
            
            updateUI(socket, g)
        }
    })

    socket.on(prefix + 'player_bet', (playerBet: number) => {
        console.log('player_bet', playerBet)
        let g = GC.getGameWithUser(socket.id)
        if(g){
            let tcgame = g.gameInstance as TarotCongolaisGame 
            try {
                tcgame.addBet( {
                    bet: playerBet,
                    player: tcgame.getPlayer(socket.id)
                })
                updateUI(socket, g)
                // updateUI(socket, g)                
            } catch (e) {
                console.log('player already bet', e)
            }
        }
    })

    socket.on(prefix + 'player_play', (cardValue: number) => {
        console.log('player_play', cardValue)
        let g = GC.getGameWithUser(socket.id);
        if(g){
            let tcgame = g.gameInstance as TarotCongolaisGame 
            // let card = new Card(cardValue)
            try {
            let tcgame = g.gameInstance as TarotCongolaisGame 
                tcgame.addPlay({
                    player: tcgame.getPlayer(socket.id),
                    card: new Card(cardValue)
                })
                updateUI(socket, g)
            } catch (error) {
                console.log('player already played')
            }            
        }
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

function updateUI(socket: SuperSocket, game: MultiplayerGame){
    let tcgame = game.gameInstance as TarotCongolaisGame
    let player = tcgame.getPlayer(socket.id)
    if(tcgame.isPlayerToBet(player)){
        tcgame.
    }
}

function newTurn(socket: SuperSocket, game: MultiplayerGame){

    sendGameInfos(socket, game)
}