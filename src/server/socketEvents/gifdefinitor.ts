import { serialize, deserialize, getDefaultModelSchema } from 'serializr'

import { SuperSocket } from '../SuperSocket';
import { GameCollection, GameStatus } from '../../common';
import { MultiplayerGame } from '../../common/modules/MultiplayerGame';

import { Game as GifDefinitorGame } from '../../common/GifDefinitor/Game'
import { prefix, NB_SECONDS_BEFORE_NEXT_TURN } from '../../common/GifDefinitor/GifDefinitor'
import { Game } from '../../common/TarotCongolais/Game';

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
            let gdgame = game.gameInstance as GifDefinitorGame
            await gdgame.startGame()
            const gif = serialize(gdgame.currentGif)

            sendGameInfos(socket, game)
            updateUI(socket, game)
        }
    })

    socket.on(prefix + 'game:send_prop', (proposition: string) => {
        let game = GC.getGameWithUser(socket.id)
        if(game){
            // game
            let gdgame = game.gameInstance as GifDefinitorGame
            gdgame.turn.addProposition({
                player: socket.getOrCreatePlayer(), 
                sentence: proposition
            })
            
            if(gdgame.turn.allPlayersAnswered()){
                socket.server.in(game.id).emit(prefix + 'game:players.time_to_vote', gdgame.turn.propositions.map(p => p.sentence))
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
            let gdgame = game.gameInstance as GifDefinitorGame
            gdgame.turn.addVote({
                voter: socket.getOrCreatePlayer(), 
                propositionIndex: propositionIndex
            })
            
            if(gdgame.turn.allPlayerVoted()){
                socket.server.in(game.id).emit(prefix + 'game:players.results_ready', gdgame.turn.votes.map(v => v.))
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
            let gdgame = game.gameInstance as GifDefinitorGame
            let winners = gdgame.turn.getWinners()
            gdgame.nextTurn()
            socket.server.in(game.id).emit(prefix + 'game:players.turn_is_complete', propositionCardIndex, winnerPlayerName)

            setTimeout( () => {
                gdgame = gdgame as GifDefinitorGame
                const sentence = serialize(gdgame.currentSentenceCard)
                console.log(gdgame.getMainPlayerSocketId(), gdgame.getPropsPlayersSocketIds());
                socket.server.to(`${gdgame.getMainPlayerSocketId()}`).emit(prefix + 'game:mp.new_turn', sentence)
                gdgame.getPropsPlayersSocketIds().forEach( (socketId: string) => {
                    const p = (gdgame as GifDefinitorGame).getPlayer(socketId)
                    const hand = p && serialize(p.hand)
                    socket.server.to(`${socketId}`).emit(prefix + 'game:op.new_turn', sentence, hand)
                })
                sendGameInfos(socket, gdgame)
            }, NB_SECONDS_BEFORE_NEXT_TURN  * 1000)
        }
    })

}

function sendGameInfos(socket: SuperSocket, game: MultiplayerGame){
    let gdgame = game.gameInstance as GifDefinitorGame
    const playersToShow: any[] = gdgame ? gdgame.players : game.players
    const uiPlayers = playersToShow.map( (p) => {
        const hasPlayedOrVoted = gdgame && (
                (!gdgame.turn.allPlayersAnswered() && gdgame.turn.hasAnswered(p) ) 
            ||  (gdgame.turn.allPlayersAnswered() && gdgame.turn.hasVoted(p))
        )
        return {
            name: p.surname,
            score: gdgame ? gdgame.getScore(p) : 0,
            hasPlayedOrVoted
        }
    })
    // console.log('game:player.ask_initial_infos', game.id, uiPlayers, game.isFirstPlayer(socket.id), initialChat)
    let myIndex = gdgame? gdgame.getPlayerIndex(gdgame.getPlayer(socket.id)) : game.getPlayerIndex(game.getPlayer(socket.id))
    console.log('prefix on super socket', prefix)
    socket.emit(prefix + 'game:player.ask_initial_infos', game.id, uiPlayers, gdgame ? gdgame.isFirstPlayer(socket.id) : game.isFirstPlayer(socket.id), myIndex)
    socket.baseSocket.to(game.id).broadcast.emit(prefix + 'game:players.new_player', uiPlayers)
}

function updateUI(socket: SuperSocket, game: MultiplayerGame){
    let gameId = game.id
    let gdgame = game.gameInstance as GifDefinitorGame
    let gameStatus;
    if(gdgame){
        if(gdgame.turn && gdgame.turn.allPlayerVoted()){
            gameStatus = GameStatus.Result
        }
        else {
            gameStatus = GameStatus.InGame
        }
    }
    else {
        gameStatus = GameStatus.Preparing
    }

    if(gdgame){
        gdgame.players.forEach(p => {
            let msgObj = {
                gifUrl: gdgame.currentGif,
                isCreator: game.players[0].isEqual(p),
                gameStatus,
                propositions: gdgame.turn ? gdgame.turn.propositions : null,
                chosenPropositionIndexes: (gdgame.turn && gdgame.turn.allPlayerVoted()) ? gdgame.turn.getWinners().map(p => gdgame.players.findIndex(pElt => pElt.isEqual(p))) : null,
                winnerPlayerNames: (gdgame.turn && gdgame.turn.allPlayerVoted()) ? gdgame.turn.getWinners() : null,
                myIndex: game.players.findIndex(pElt => pElt.isEqual(p))
            }
        })
    }
}