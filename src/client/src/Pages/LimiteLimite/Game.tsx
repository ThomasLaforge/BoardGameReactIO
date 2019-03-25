import * as React from 'react';
import {socketConnect} from 'socket.io-react'
import {observer, inject} from 'mobx-react';
import { DefaultProps, injector } from '../../mobxInjector'
import {deserialize} from 'serializr'

import { GameStatus, SentenceCard, Hand, PropositionCard } from 'boardgamereactio-common';
import { ChatMessage } from 'boardgamereactio-common/modules/Server';
import { prefix } from 'boardgamereactio-common/LimiteLimite/LimiteLimite'

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
    isFirstPlayer: boolean
    gameStatus: GameStatus
    players: any

    sentence?: SentenceCard
    propositions?: any
    chosenPropositionIndex?: number
    hand?: any
    winnerPlayerName?: string
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
            socket.emit(prefix + 'game:ask_initial_infos')

            socket.on(prefix + 'game:player.ask_initial_infos', (gameId: string, players: any, isCreator: boolean, nbPlayer: number, initialChat: ChatMessage[]) => {
                console.log('players1', gameId, players, isCreator, nbPlayer)
                this.setState({gameId, isCreator, players })
            })
            socket.on(prefix + 'game:players.new_player', (players) => {
                console.log('players2', players)
                this.setState({ players })
            })

            socket.on(prefix + 'game:mp.start', (sentenceJSON) => {
                console.log('game:mp.start', sentenceJSON)
                this.setState({
                    gameStatus: GameStatus.InGame,
                    isFirstPlayer: true,
                    sentence: deserialize(SentenceCard, sentenceJSON),
                })
            })
            
            socket.on(prefix + 'game:op.start', (sentenceJSON, handJSON) => {
                console.log('game:op.start', sentenceJSON, handJSON)
                this.setState({
                    gameStatus: GameStatus.InGame,
                    isFirstPlayer: false,
                    sentence: deserialize(SentenceCard, sentenceJSON),
                    hand: deserialize(Hand, handJSON)
                })
            })

            socket.on(prefix + 'game:players.turn_to_resolve', (propositions) => {
                console.log('game:players.turn_to_resolve')
                this.setState({ 
                    gameStatus: GameStatus.Result,
                    propositions: propositions.map(pJSON => deserialize(PropositionCard, pJSON))
                })
            })

            socket.on(prefix + 'game:player.player_has_played', () => {
                console.log('game:player.player_has_played')

            })

            socket.on(prefix + 'game:players.turn_is_complete', (chosenPropositionIndex, winnerPlayerName) => {
                this.setState({ chosenPropositionIndex, winnerPlayerName })
            })
            
            socket.on(prefix + 'game:mp.new_turn', (sentenceJSON) => {
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
            socket.on(prefix + 'game:op.new_turn', (sentenceJSON, handJSON) => {
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
        this.props.socket.emit(prefix + 'game:start')
    }

    renderPlayers(){
        console.log('show players', this.state.players)
        return this.state.players.map( (p, k) => 
            <div 
                key={k}
                className={'player'}  
            >
                <div className="player-score">{p.score}</div>
                <div className="player-name">{p.name}</div>
                <div className="player-has-error">{p.hasError}</div>   
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
