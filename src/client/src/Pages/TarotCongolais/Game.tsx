import * as React from 'react';
import {socketConnect} from 'socket.io-react'
import {observer, inject} from 'mobx-react';
import { DefaultProps, injector } from '../../mobxInjector'
import {deserialize, serialize} from 'serializr'

import {PlayerListUI, PlayerListUIElt} from 'limitelimite-common/LimiteLimiteUI'
import { prefix } from 'limitelimite-common/TarotCongolais/TarotCongolais'
import { Hand } from 'limitelimite-common/TarotCongolais/Hand'

// console.log('prefix on render', prefix)

import Chat from '../../components/Chat';

import './game.scss'
import BetPhase from './GameParts/BetPhase';
import SoloCardPhase from './GameParts/SoloCardPhase';
import TrickPhase from './GameParts/TrickPhase';
import BeforeGameStart from './GameParts/BeforeGameStart';

interface GameProps extends DefaultProps {
}
interface GameState {
    players: any[]
    gameId: string
    isCreator: boolean,
    myIndex: number

    // to build game states
    isPlayerToBet?: boolean
    isPlayerToPlay?: boolean
    isGameOver?: boolean
    nbTurnCards?: number

    // game elts
    hand?: Hand
}

@inject(injector)
@observer
@socketConnect
class Game extends React.Component <GameProps, GameState> {

    constructor(props: GameProps){
        super(props)
        this.state = {
            gameId: '',
            isCreator: false,
            players: [],
            myIndex: 0
        }
    }

    componentDidMount(){
        if(this.props.socket){
            const socket = this.props.socket
            socket.emit(prefix + 'game:ask_initial_infos')

            socket.on(prefix + 'game:player.ask_initial_infos', (gameId: string, players: any[], isCreator: boolean) => {
                console.log('players1', gameId, players)
                this.setState({gameId, players, isCreator })
            })
            socket.on(prefix + 'game:players.new_player', (players: PlayerListUI) => {
                console.log('players2', players)
                this.setState({ players })
            })
        }
    }

    startGame = () => {
        this.props.socket.emit(prefix + 'game:start')
    }

    renderPlayers(){
        // console.log('show players', this.state.players)
        return this.state.players.map( (p: any, k) => 
            <div 
                key={k}
                className={'player' 
                    + (k === this.state.myIndex ? ' player-me' : '')
                }  
            >
                <div className="player-pv">{p.pv}</div>
                <div className="player-name">{p.name}</div>
                <div className="player-bet">{p.bet}</div>   
                <div className="player-tricks">{p.nbTricks}</div>   
            </div>
        )
    }

    handleBet = (betValue: number) => {
        console.log('bet to send', betValue)
    }

    handleSoloPrediction = (answer: boolean) => {
        console.log('prediction chosen', answer)
    }

    handlePlay = (cardIndex: number) => {
        console.log('play', cardIndex)
    }

    render() {
        const { 
            isPlayerToBet, isPlayerToPlay, nbTurnCards, isGameOver,
            hand
        } = this.state

        return (
            <div className='game'>
                <div className="game-infos">
                    <div className="game-players">
                        {this.renderPlayers()}
                    </div>
                    <div className="game-chat">
                        <Chat channel={this.state.gameId} />
                    </div>
                </div>
                <div className="game-content">
                    { !isPlayerToBet && !isPlayerToPlay && !isGameOver &&
                        <BeforeGameStart
                            gameId={this.state.gameId}
                            isCreator={this.state.isCreator}
                            nbPlayers={this.state.players.length}
                            nbPlayersToStart={4}
                            startGame={this.startGame}
                        />
                    }

                    { !!isPlayerToBet && 
                        <BetPhase 
                            hand={hand}
                            onValidateBet={this.handleBet}
                        />
                    }

                    { !!isPlayerToPlay && nbTurnCards === 1 && 
                        <SoloCardPhase
                            onPrediction={this.handleSoloPrediction}
                            otherPlayersCards={[]}
                        />
                    }

                    { !!isPlayerToPlay && nbTurnCards > 1 &&  
                        <TrickPhase
                            hand={hand}
                            onPlay={this.handlePlay}
                            otherPlayersTricks={[]}
                        />
                    }
                    { isGameOver && 
                        <div>Game over!</div>
                    }
                </div>
            </div>
        );
    }
}

export default Game;
