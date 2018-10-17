import * as React from 'react';
import {socketConnect} from 'socket.io-react'
import {observer, inject} from 'mobx-react';
import { DefaultProps, injector } from '../../mobxInjector'
import {deserialize, serialize} from 'serializr'

import { GameStatus, DEFAULT_IS_PRIVATE_GAME, SentenceCard, Hand, PropositionCard } from 'limitelimite-common';
import {PlayerListUI, PlayerListUIElt} from 'limitelimite-common/LimiteLimiteUI'
import { ChatMessage } from 'limitelimite-common/Server';

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
    isFirstPlayer: boolean
    gameStatus: GameStatus
    players: PlayerListUI

    sentence?: SentenceCard
    propositions?: any
    chosenPropositionIndex?: number
    hand?: any
    winnerPlayerName?: string
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
            isFirstPlayer: false,
            gameStatus: GameStatus.Preparing,
            players: [],
            winnerPlayerName: ''
        }
    }

    componentDidMount(){
        if(this.props.socket){
            const socket = this.props.socket
            socket.emit('game:ask_initial_infos')

            socket.on('game:player.ask_initial_infos', (gameId: string, players: PlayerListUI, isCreator: boolean, myIndex: number, initialChat: ChatMessage[]) => {
                console.log('players1', gameId, players, isCreator, myIndex, initialChat)
                this.setState({gameId, isCreator, players, myIndex })
            })
            socket.on('game:players.new_player', (players: PlayerListUI) => {
                console.log('players2', players)
                this.setState({ players })
            })

            socket.on('game:mp.start', (sentenceJSON) => {
                console.log('game:mp.start', sentenceJSON)
                this.setState({
                    gameStatus: GameStatus.InGame,
                    isFirstPlayer: true,
                    sentence: deserialize(SentenceCard, sentenceJSON),
                })
            })
            
            socket.on('game:op.start', (sentenceJSON, handJSON) => {
                console.log('game:op.start', sentenceJSON, handJSON)
                this.setState({
                    gameStatus: GameStatus.InGame,
                    isFirstPlayer: false,
                    sentence: deserialize(SentenceCard, sentenceJSON),
                    hand: deserialize(Hand, handJSON)
                })
            })

            socket.on('game:players.turn_to_resolve', (propositions) => {
                console.log('game:players.turn_to_resolve')
                this.setState({ 
                    gameStatus: GameStatus.Result,
                    propositions: propositions.map(pJSON => deserialize(PropositionCard, pJSON))
                })
            })

            socket.on('game:player.player_has_played', () => {
                console.log('game:player.player_has_played')

            })

            socket.on('game:players.turn_is_complete', (chosenPropositionIndex, winnerPlayerName) => {
                this.setState({ chosenPropositionIndex, winnerPlayerName })
            })
            
            socket.on('game:mp.new_turn', (sentenceJSON) => {
                console.log('game:mp.new_turn', sentenceJSON)
                this.setState({
                    gameStatus: GameStatus.InGame,
                    isFirstPlayer: true,
                    sentence: deserialize(SentenceCard, sentenceJSON),
                    
                    // resets
                    hand: null,
                    propositions: [],
                    chosenPropositionIndex: null,
                    winnerPlayerName: ''
                })

            })
            socket.on('game:op.new_turn', (sentenceJSON, handJSON) => {
                console.log('game:op.new_turn', sentenceJSON, handJSON)
                this.setState({
                    gameStatus: GameStatus.InGame,
                    isFirstPlayer: false,
                    sentence: deserialize(SentenceCard, sentenceJSON),
                    hand: deserialize(Hand, handJSON),
                    
                    // resets
                    propositions: [],
                    chosenPropositionIndex: null,
                    winnerPlayerName: ''
                })
            })

        }
    }

    startGame = () => {
        this.props.socket.emit('game:start')
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
                            chosenPropositionIndex={this.state.chosenPropositionIndex}
                            isFirstPlayer={this.state.isFirstPlayer}
                            winnerPlayerName={this.state.winnerPlayerName}
                        />
                    }
                </div>
            </div>
        );
    }
}

export default Game;
