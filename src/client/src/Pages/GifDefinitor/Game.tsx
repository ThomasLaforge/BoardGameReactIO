import * as React from 'react';
import {socketConnect} from 'socket.io-react'
import {observer, inject} from 'mobx-react';
import { DefaultProps, injector } from '../../mobxInjector'
import {deserialize, serialize} from 'serializr'

import { GameStatus } from 'limitelimite-common';
import {PlayerListUI, PlayerListUIElt} from 'limitelimite-common/LimiteLimiteUI'
import { ChatMessage } from 'limitelimite-common/Server';
import { prefix } from 'limitelimite-common/GifDefinitor/GifDefinitor'

import GameBeforeStart from './GameParts/GameBeforeStart';
import GamePropositionSender from './GameParts/GamePropositionSender';
import GamePropositionChoser from './GameParts/GamePropositionChoser';
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
    winnerPlayerNames?: string[]
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
            winnerPlayerNames: []
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

    // socket events
    startGame = () => {
        this.props.socket.emit(prefix + 'game:start')
    }

    handleSendProp = (propostion: string) => {
        this.props.socket.emit(prefix + 'game:send-prop', propostion)
    }

    handleVote = (propostionChoice: number) => {
        this.props.socket.emit(prefix + 'game:send-vote', propostionChoice)
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

                    {this.state.gameStatus === GameStatus.InGame && !this.state.propositions &&
                        <GamePropositionSender
                            gifUrl={this.state.gifUrl}
                            handleSendProp={this.handleSendProp}
                        />
                    }

                    {this.state.gameStatus === GameStatus.InGame && this.state.propositions &&
                        <GamePropositionChoser
                            gifUrl={this.state.gifUrl}
                            propositions={this.state.propositions}
                            handleVote={this.handleVote}
                        />
                    }                 
                    
                    {this.state.gameStatus === GameStatus.Result &&
                        <GameResult
                            gifUrl={this.state.gifUrl}
                            propositions={this.state.propositions}
                            chosenPropositionIndexes={this.state.chosenPropositionIndexes}
                            winnerPlayerNames={this.state.winnerPlayerNames}
                        />
                    }
                </div>
            </div>
        );
    }
}

export default Game;
