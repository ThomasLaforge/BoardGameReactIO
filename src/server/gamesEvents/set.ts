// import { serialize, deserialize } from 'serializr'

import { SuperSocket } from '../SuperSocket';

import {prefix} from '../../common/Set/definitions'
import { MultiplayerGame } from '../../common/modules/MultiplayerGame';
import { Game as SetGame } from '../../common/Set/Game'
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
        console.log('cards', cards)
        let game = GC.getGameWithUser(socket.id)
        let setgame = game && game.gameInstance as SetGame | undefined
        let p = setgame && setgame.players.find(p => p.socketid === socket.socketPlayer.socketid)
        if(game && setgame && p){
            setgame.tryToAddPlay(p, cards)
            updateUI(socket, game)
        }
    })
}

function sendGameInfos(socket: SuperSocket, game: MultiplayerGame, initialCall = false){
    let setgame = game.gameInstance as SetGame | undefined
    let players: any = setgame ? setgame.players : game.players
    let nbPlayer = setgame ? setgame.nbPlayer : game.nbPlayer
    
    const uiPlayers = players.map( (p: any) => (
        {
            name: setgame ? p.username : p.surname,
            score: setgame ? setgame.getPlayerScore(p) : 0
        }
    ))

    // console.log('game:player.ask_initial_infos', game.id, uiPlayers, game.isFirstPlayer(socket.id), initialChat)
    socket.emit(prefix + 'game:player.ask_initial_infos', game.id, uiPlayers, game.isFirstPlayer(socket.socketPlayer.socketid), nbPlayer)
    socket.baseSocket.to(game.id).broadcast.emit(prefix + 'game:players.new_player', uiPlayers)
}

function updateUI(socket: SuperSocket, game: MultiplayerGame){
    // Return array
    // socket.on(prefix + 'game:players.update', (isGameOver: boolean, nbTurnCards: number, gamePhase: GamePhase, bets: Bet[], plays: Play[], isPlayerToBet: boolean, isPlayerToPlay: boolean, hand: Hand, otherPlayersSoloCards: TCCard[]) => {
    
    let tcgame = game.gameInstance as SetGame
    if(tcgame){
        let params: any[] = [
            tcgame.isGameOver(),
            tcgame.field && tcgame.field.cards,
            tcgame.deck.length
        ]

        tcgame.players.forEach( p => {
            // let nextPlayer: TCPlayer = tcgame.players[tcgame.getNextPlayerIndex()]
            // console.log('isFirst bet, play', tcgame.isPlayerToBet(p), tcgame.isPlayerToPlay(p), p.socketid)
            // console.log('hand', p.hand.cards[0])
            let playerSpecificsParams = params.slice()
            playerSpecificsParams.push()

            socket.server.to(p.socketid).emit(prefix + 'game:players.update', ...playerSpecificsParams)
        })
        sendGameInfos(socket, game)
    }
}