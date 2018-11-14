import * as React from 'react';
import {socketConnect} from 'socket.io-react'
import {observer, inject} from 'mobx-react';
import { DefaultProps, injector } from '../../mobxInjector'
import {deserialize, serialize} from 'serializr'

import { GameStatus } from 'limitelimite-common';
import {PlayerListUI, PlayerListUIElt} from 'limitelimite-common/LimiteLimiteUI'
import { ChatMessage } from 'limitelimite-common/Server';
import { prefix } from 'limitelimite-common/GifDefinitor/GifDefinitor'

console.log('prefix on render', prefix)

import GamePropositionPlayer from './GameParts/GamePropositionPlayer';
import GameBeforeStart from './GameParts/GameBeforeStart';
import GameMainPlayer from './GameParts/GameMainPlayer';
import GameResult from './GameParts/GameResult';
import Chat from '../../components/Chat';

import './game.scss'

interface GameProps extends DefaultProps {
}
interface GameState {
    gameId: string
    isCreator: boolean
    gameStatus: GameStatus
    players: PlayerListUI

    gifUrl?: string
    propositions?: any
    chosenPropositionIndexes?: number[]
    winnerPlayerNames?: string
    myIndex?: number
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
            gameStatus: GameStatus.Preparing,
            players: [],
            winnerPlayerNames: ''
        }
    }

    componentDidMount(){
        if(this.props.socket){
            const socket = this.props.socket
            socket.emit(prefix + 'game:ask_initial_infos')

            socket.on(prefix + 'game:player.ask_initial_infos', (gameId: string, players: PlayerListUI, isCreator: boolean, myIndex: number, initialChat: ChatMessage[]) => {
                console.log('players1', gameId, players, isCreator, myIndex, initialChat)
                this.setState({gameId, isCreator, players, myIndex })
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
        console.log('show players', this.state.players)
        return this.state.players.map( (p: PlayerListUIElt, k) => 
            <div 
                key={k}
                className={'player' 
                    // red color for first player  
                    // + (this.state.gameStatus !== GameStatus.Preparing && p.isFirstPlayer ? ' first-player' : '')
                    + (k === this.state.myIndex ? ' player-me' : '')
                }  
            >
                <div className="player-score">{p.score}</div>
                <div className="player-name">{p.name}</div>
                <div className="player-status">
                    { p.isFirstPlayer && 
                        <div className="player-status-is-boss">Boss</div>
                    }
                    { this.state.gameStatus === GameStatus.InGame && !p.isFirstPlayer && p.hasPlayed && 
                        <div className="player-status-has-played">&#x2714;</div>
                    }
                    { this.state.gameStatus === GameStatus.InGame && !p.isFirstPlayer && !p.hasPlayed &&
                    <div className="player-status-choosing">...</div>
                    }
                </div>   
            </div>
        )
    }

    render() {
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
                    {this.state.gameStatus === GameStatus.Preparing &&
                        <GameBeforeStart
                            isCreator={this.state.isCreator}
                            nbPlayers={this.state.players.length}
                            gameId={this.state.gameId}
                            startGame={this.startGame}
                        />
                    }

                    {this.state.gameStatus === GameStatus.InGame && this.state.isFirstPlayer &&
                        <GameMainPlayer
                            sentence={this.state.sentence}
                            propositions={this.state.propositions}
                        />
                    }                 
                    
                    {this.state.gameStatus === GameStatus.InGame && !this.state.isFirstPlayer &&
                        <GamePropositionPlayer
                            sentence={this.state.sentence}
                            hand={this.state.hand}
                        />
                    }

                    
                    {this.state.gameStatus === GameStatus.Result &&
                        <GameResult
                            sentence={this.state.sentence}
                            propositions={this.state.propositions}
                            chosenPropositionIndexes={this.state.chosenPropositionIndexes}
                            isFirstPlayer={this.state.isFirstPlayer}
                            winnerPlayerNames={this.state.winnerPlayerNames}
                        />
                    }
                </div>
            </div>
        );
    }
}

export default Game;
