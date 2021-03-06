// import { serialize, deserialize } from 'serializr'

import { SuperSocket } from '../SuperSocket';

import {prefix, DEFAULT_START_PV, DELAY_BETWEEN_TWO_TRICKS} from '../../common/TarotCongolais/TarotCongolais'
import { MultiplayerGame } from '../../common/modules/MultiplayerGame';
import { Game as TarotCongolaisGame } from '../../common/TarotCongolais/Game'
import { serialize } from 'serializr';
import { GameCollection } from '../../common';

export const addTarotCongolaisEvents = (socket: SuperSocket, GC: GameCollection) => {

    let waitingNextTurn = false

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
            
            updateUI(socket, game)
        }
    })

    socket.on(prefix + 'player_bet', (playerBet: number) => {
        let g = GC.getGameWithUser(socket.id)
        if(g && !waitingNextTurn){
            let tcgame = g.gameInstance as TarotCongolaisGame 
            try {
                console.log('player betting')
                tcgame.addBet( {
                    bet: playerBet,
                    player: tcgame.getPlayer(socket.id)
                })
                updateUI(socket, g)
            } catch (e) {
                console.log('player already bet', e)
            }
        }
    })

    socket.on(prefix + 'player_play', (cardIndex: number, value: number) => {
        let g = GC.getGameWithUser(socket.id);
        if(g && !waitingNextTurn){
            try {
                let tcgame = g.gameInstance as TarotCongolaisGame 
                let player = tcgame.getPlayer(socket.id)
                let card = player.hand.cards[cardIndex]
                if(card.isExcuse()){
                    card.choseExcuseValue(value)
                }
                console.log('player_play', cardIndex, player.hand.cards[cardIndex])
                tcgame.addPlay({ player, card })
                updateUI(socket, g)
                if(tcgame.actualTrick.isComplete()){
                    waitingNextTurn = true
                    setTimeout(() => {
                        tcgame.addTrick()
                        waitingNextTurn = false
                        updateUI(socket, g as MultiplayerGame)
                    }, DELAY_BETWEEN_TWO_TRICKS)
                }
            } catch (error) {
                console.log('player already played')
            }            
        }
    })
}

function sendGameInfos(socket: SuperSocket, game: MultiplayerGame, initialCall = false){
    let tcgame = game.gameInstance as TarotCongolaisGame | undefined
    let players: any = tcgame ? tcgame.playersFPOV : game.players
    let nbPlayer = tcgame ? tcgame.getNbPlayer() : game.nbPlayer
    const isFirstPlayer = game.isFirstPlayer(socket.socketPlayer.socketid)

    const uiPlayers = players.map( (p: any) => (
        {
            name: tcgame ? p.username : p.surname,
            pv: tcgame ? p.pv : DEFAULT_START_PV,
            bet: tcgame && tcgame.getBet(p),
            nbTricks: tcgame ? tcgame.getNbWonTrick(p) : 0,
        }
    ))

    // console.log('game:player.ask_initial_infos', game.id, uiPlayers, game.isFirstPlayer(socket.id), initialChat)
    socket.emit(prefix + 'game:player.ask_initial_infos', game.id, uiPlayers, isFirstPlayer, nbPlayer)
    socket.baseSocket.to(game.id).broadcast.emit(prefix + 'game:players.new_player', uiPlayers)
}

function updateUI(socket: SuperSocket, game: MultiplayerGame){
    // Return array
    // socket.on(prefix + 'game:players.update', (isGameOver: boolean, nbTurnCards: number, gamePhase: GamePhase, bets: Bet[], plays: Play[], isPlayerToBet: boolean, isPlayerToPlay: boolean, hand: Hand, otherPlayersSoloCards: TCCard[]) => {
    
    let tcgame = game.gameInstance as TarotCongolaisGame
    if(tcgame){
        let params: any[] = [
            tcgame.isGameOver(),
            tcgame.getNbCardForTurn(),
            tcgame.getGamePhase(),
            tcgame.turn.arrBet,
            tcgame.actualTrick.arrPlay,
        ]

        tcgame.players.forEach( p => {
            // let nextPlayer: TCPlayer = tcgame.players[tcgame.getNextPlayerIndex()]
            // console.log('isFirst bet, play', tcgame.isPlayerToBet(p), tcgame.isPlayerToPlay(p), p.socketid)
            // console.log('hand', p.hand.cards[0])
            let otherPlayers = tcgame.players.filter(op => !op.isEqual(p))
            let playerSpecificsParams = params.slice()
            playerSpecificsParams.push(
                tcgame.isPlayerToBet(p),
                tcgame.isPlayerToPlay(p),
                tcgame.getNbCardForTurn() > 1 ? serialize(p.hand) : undefined,
                tcgame.getNbCardForTurn() === 1 ? otherPlayers.map(p => p.hand.cards[0]) : undefined,
                tcgame.isLastPlayer(p)
            )

            socket.server.to(p.socketid).emit(prefix + 'game:players.update', ...playerSpecificsParams)
        })
        sendGameInfos(socket, game)
    }
}