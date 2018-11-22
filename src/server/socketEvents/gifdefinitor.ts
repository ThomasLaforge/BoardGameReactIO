import { serialize, deserialize, getDefaultModelSchema } from 'serializr'

import { SuperSocket } from '../SuperSocket';
import { GameCollection, GameStatus } from '../../common';
import { MultiplayerGame } from '../../common/modules/MultiplayerGame';

import { Game as GifDefinitorGame } from '../../common/GifDefinitor/Game'
import { prefix, NB_SECONDS_BEFORE_NEXT_TURN } from '../../common/GifDefinitor/GifDefinitor'

export const addGifDefinitorEvents = (socket: SuperSocket, GC: GameCollection) => {
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

            updateUI(socket, game)
        }
    })

    socket.on(prefix + 'game:send_prop', (proposition: string) => {
        let game = GC.getGameWithUser(socket.id)
        let gdgame = game && game.gameInstance as GifDefinitorGame
        if(game && gdgame && gdgame.turn){
            // game
            gdgame.turn.addProposition({
                player: socket.getOrCreatePlayer(), 
                sentence: proposition
            })
            
            // if(gdgame.turn.allPlayersAnswered()){
            //     socket.server.in(game.id).emit(prefix + 'game:players.time_to_vote', gdgame.turn.propositions.map(p => p.sentence))
            // }
            // else {
            //     socket.emit(prefix + 'game:player.player_has_played')
            // }

            updateUI(socket, game)
        }
    })

    socket.on(prefix + 'game:send_vote', (uiPropositionIndex: number) => {
        let game = GC.getGameWithUser(socket.id)
        let gdgame = game && game.gameInstance as GifDefinitorGame
        if(game && gdgame && gdgame.turn){
            const player = socket.getOrCreatePlayer()
            
            // get proposition index from ui proposition index
            let propositionIndex = uiPropositionIndex
            if( gdgame.getPlayerIndex(player) <= uiPropositionIndex ){
                propositionIndex++
            }

            // add vote
            gdgame.turn.addVote({
                voter: player, 
                propositionIndex: propositionIndex
            })  
            
            updateUI(socket, game)

            // If turn is complete, wait x seconds and start the next turn
            if(gdgame.turn.allPlayerVoted()){
                console.log('nextTurn start in ', NB_SECONDS_BEFORE_NEXT_TURN, ' seconds')            
                setTimeout( async () => {
                    gdgame = gdgame as GifDefinitorGame
                    await gdgame.nextTurn()
                    console.log('nextTurn send new turn', gdgame.players.map(p => gdgame && gdgame.getScore(p)))
                    updateUI(socket, game as MultiplayerGame)
                }, NB_SECONDS_BEFORE_NEXT_TURN  * 1000)
            }
            // else {
            //     socket.emit(prefix + 'game:player.player_has_played')
            // }
        }
    })

}

function sendGameInfos(socket: SuperSocket, game: MultiplayerGame){
    let gdgame = game.gameInstance as GifDefinitorGame
    const playersToShow: any[] = gdgame ? gdgame.players : game.players
    const uiPlayers = playersToShow.map( (p) => {
        const hasPlayedOrVoted = gdgame && gdgame.turn && (
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
    let myIndex = game.getPlayerIndex(game.getPlayer(socket.id))
    socket.emit(prefix + 'game:player.ask_initial_infos', game.id, uiPlayers, game.isFirstPlayer(socket.id), myIndex)
    socket.baseSocket.to(game.id).broadcast.emit(prefix + 'game:players.new_player', uiPlayers)
}

function updateUI(socket: SuperSocket, game: MultiplayerGame){
    let gameId = game.id
    let gdgame = game.gameInstance as GifDefinitorGame
    let gameStatus: GameStatus;
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
            let propositions;
            if(gdgame.turn && gdgame.turn.propositions && gdgame.turn.propositions.length === gdgame.players.length){
                if(gdgame.turn.allPlayerVoted()){
                    propositions = gdgame.turn.propositions
                }
                else {
                    propositions = gdgame.turn.propositions.filter(prop => !prop.player.isEqual(p))
                }
            } 
            else {
                propositions = null
            }

            let msgObj: any = {
                gifUrl: gdgame.currentGif && gdgame.currentGif.url,
                // isCreator: game.players[0].isEqual(p),
                gameStatus,
                propositions,
                chosenPropositionIndexes: (gdgame.turn && gdgame.turn.allPlayerVoted()) ? gdgame.turn.getWinners().map(p => gdgame.players.findIndex(pElt => pElt.isEqual(p))) : null,
                winnerPlayerNames: (gdgame.turn && gdgame.turn.allPlayerVoted()) ? gdgame.turn.getWinners() : null,
                myIndex: game.players.findIndex(pElt => pElt.isEqual(p))
            }
            const playerSpecificsParams = Object.keys(msgObj).map( (e: any) => msgObj[e])

            socket.server.to(p.socketid).emit(prefix + 'game:players.update', ...playerSpecificsParams)
        })

        sendGameInfos(socket, game)
    }

}