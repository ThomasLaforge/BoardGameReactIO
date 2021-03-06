// import { serialize, deserialize } from 'serializr'

import { SuperSocket } from '../SuperSocket';

import {prefix, NEXT_TURN_DELAY} from '../../common/Set/definitions'
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
        let game = GC.getGameWithUser(socket.id)
        let setgame = game && game.gameInstance as SetGame | undefined
        let p = setgame && setgame.players.find(p => p.socketid === socket.socketPlayer.socketid)
        console.log('cards', cards, game && setgame && p)
        if(game && setgame && p){
            const isValid = setgame.tryToAddPlay(p, cards)
            if(isValid){
                const lastPlay = setgame.getLastPlay()
                socket.server.in(game.id).emit(prefix + 'game:new_play', serialize(lastPlay.combination), socket.id);
                setTimeout(() => { 
                    (setgame as SetGame).resetTurn()
                    updateUI(socket, game as MultiplayerGame) }, 
                    NEXT_TURN_DELAY
                )
            }
            else {
                updateUI(socket, game)
            } 
        }
    })

    socket.on(prefix + 'game:add-cards', () => {
        let game = GC.getGameWithUser(socket.id)
        let setgame = game && game.gameInstance as SetGame | undefined
        if(setgame) {
            setgame.nextTurn(true)
            updateUI(socket, game as MultiplayerGame)
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
            socketid: p.socketid,
            score: setgame ? setgame.getPlayerScore(p) : 0,
            hasError: setgame && setgame.playerHasAnError(p)
        }
    ))

    // console.log('game:player.ask_initial_infos', game.id, uiPlayers, game.isFirstPlayer(socket.id), initialChat)
    socket.emit(prefix + 'game:player.ask_initial_infos', game.id, uiPlayers, game.isFirstPlayer(socket.socketPlayer.socketid), nbPlayer)
    socket.baseSocket.to(game.id).broadcast.emit(prefix + 'game:players.new_player', uiPlayers)
}

function updateUI(socket: SuperSocket, game: MultiplayerGame){
    let setgame = game.gameInstance as SetGame
    if(setgame){
        // console.log('updateUI', setgame)
        let params: any[] = [
            setgame.isGameOver(),
            setgame.field && serialize(setgame.field),
            setgame.deck.length
        ]

        setgame.players.forEach( p => {
            let playerSpecificsParams = params.slice()
            playerSpecificsParams.push(
                setgame.playerHasAnError(p)
            )

            socket.server.to(p.socketid).emit(prefix + 'game:players.update', ...playerSpecificsParams)
        })
        sendGameInfos(socket, game)
    }
}