import * as React from 'react';
import {socketConnect} from 'socket.io-react'
import {observer, inject} from 'mobx-react';
import { DefaultProps, injector } from '../../mobxInjector'
import {deserialize} from 'serializr'

import Chat from '../../components/Chat';
import { ChatMessage } from 'boardgamereactio-common/modules/Server';
import { GameStatus } from 'boardgamereactio-common';
import { prefix } from 'boardgamereactio-common/Flip/defs'
import { Card as CardModel } from 'boardgamereactio-common/Flip/Card';

import { Button } from '@material-ui/core';
import GameResult from './GameParts/GameResult';
import BeforeGameStart from './GameParts/BeforeGameStart';
import Player from './components/Player/Player';
import Stack from './components/Stack/Stack';

import './game.scss'

interface GameProps extends DefaultProps {
}
interface GameState {
    gameId: string
    isCreator: boolean
    gameStatus: GameStatus
    players: any

    selectedCardsIndex: number
    stackValues: number[]
    deckSize?: number
    winner?: string
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
            selectedCardsIndex: null,
            stackValues: [null, null]
        }
    }

    componentDidMount(){
        if(this.props.socket){
            const socket = this.props.socket

            socket.emit(prefix + 'game:ask_initial_infos')

            socket.on(prefix + 'game:player.ask_initial_infos', (gameId: string, players: any, isCreator: boolean, myIndex: number, initialChat: ChatMessage[]) => {
                console.log('players1', gameId, players, isCreator, myIndex, initialChat)
                this.setState({gameId, isCreator, players })
            })
            socket.on(prefix + 'game:players.new_player', (players) => {
                console.log('players2', players)
                this.setState({ players })
            })

            socket.on(prefix + 'game:players.update', (isGameOver, fieldJSON, deckSize, hasError) => {
                console.log('game:players.update', isGameOver, fieldJSON, deckSize, hasError)
                this.setState({
                    deckSize,
                    gameStatus: isGameOver ? GameStatus.Finished : GameStatus.InGame
                })
            })

            socket.on(prefix + 'game:new_play', (combination, socketId) => {
                console.log('game:new_play', combination, socketId)

                // this.setState({
                //     winner: socketId,
                //     selectedCardsIndex: []
                // })
            })
        }
    }

    startGame = () => {
        this.props.socket.emit(prefix + 'game:start')
    }

    renderPlayers(){
        return this.state.players.map( (p, k) => 
            <div 
                key={k}
                className='player'
            >
                <div className="player-name">{p.name}</div>
                <div className="player-score">{p.score}</div>
                <div className="player-has-error">{p.hasError && 'X'}</div>
            </div>
        )
    }

    handleStress = () => {
        this.props.socket.emit('stress')
    }

    selectCard = (index: number) => {
        this.setState({
            selectedCardsIndex: this.state.selectedCardsIndex === index ? undefined : index
        })
    }

    getSelectedCards(){
    }

    renderStacks(){
        return this.state.stackValues.map(v => {
            <Stack value={v} />
        })
    }

    render() {
        return (
            <div className='game flip-game'>
                <div className="game-infos">
                    <div className="game-players">
                        {this.renderPlayers()}
                    </div>
                    <div className="game-chat">
                        <Chat channel={this.state.gameId} />
                    </div>
                </div>
                <div className="game-content">
                    {this.state.gameStatus === GameStatus.Finished && 
                        <GameResult />
                    }
                    {this.state.gameStatus === GameStatus.InGame && 
                        <div className="ingame">
                        <div className="opponent">
                            <Player
                                isPlayer={false}
                                cards={[ new CardModel(1, 1)]}
                                deckCount={0}                                
                            />
                        </div>
                        
                        <div className="stacks">
                            {this.renderStacks()}
                        </div>

                        <Button 
                            className={'stress-btn'}
                            variant='raised'
                            onClick={this.handleStress}
                        >
                            STRESS !!!
                        </Button>

                        <div className="me">
                            <Player
                                isPlayer={false}
                                cards={[ new CardModel(3, 1)]}
                                deckCount={5}
                                onSelectCard={this.selectCard}
                                selectedCardIndex={this.state.selectedCardsIndex}
                            />
                        </div>
                    </div>
                    }
                    {this.state.gameStatus === GameStatus.Preparing && 
                        <BeforeGameStart 
                            isCreator={this.state.isCreator}
                            gameId={this.state.gameId}
                            startGame={this.startGame}
                            nbPlayers={this.state.players.length}
                        />
                    }
                </div>
            </div>
        );
    }
}

export default Game;
