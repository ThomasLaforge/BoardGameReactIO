import * as React from 'react';
import {socketConnect} from 'socket.io-react'
import {observer, inject} from 'mobx-react';
import { DefaultProps, injector } from '../../mobxInjector'
import {deserialize} from 'serializr'

import { Game as SetGame } from 'boardgamereactio-common/Set/Game'
import { Field as SetField } from 'boardgamereactio-common/Set/Field';

import Field from "./components/Field/Field";

import { prefix } from 'boardgamereactio-common/Set/definitions'
import Chat from '../../components/Chat';
import { ChatMessage } from 'boardgamereactio-common/modules/Server';
import { GameStatus } from 'boardgamereactio-common';

import './game.scss'
import { Button } from '@material-ui/core';
import GameResult from './GameParts/GameResult';
import BeforeGameStart from './GameParts/BeforeGameStart';
import { Combination as SetCombination } from 'boardgamereactio-common/Set/Combination';

interface GameProps extends DefaultProps {
}
interface GameState {
    gameId: string
    isCreator: boolean
    gameStatus: GameStatus
    players: any
    showSolution: boolean

    field: SetField
    selectedCardsIndex: number[]
    hasAlreadyPlayed: boolean
    deckSize?: number
    combination?: SetCombination
    winner?: string
}

@inject(injector)
@observer
@socketConnect
class Game extends React.Component <GameProps, GameState> {

    constructor(props: GameProps){
        super(props)
        const game = new SetGame([])
        const demoField = game.field
        console.log('field', demoField)
        this.state = {
            gameId: '',
            isCreator: false,
            gameStatus: GameStatus.Preparing,
            players: [],
            field: null,
            selectedCardsIndex: [],
            hasAlreadyPlayed: false,
            showSolution: false
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
                const field = deserialize(SetField, fieldJSON)
                this.setState({
                    field,
                    deckSize,
                    gameStatus: isGameOver ? GameStatus.Finished : GameStatus.InGame,
                    hasAlreadyPlayed: hasError,
                    combination: null
                })
            })

            socket.on(prefix + 'game:new_play', (combination, socketId) => {
                console.log('game:new_play', combination, socketId)

                this.setState({
                    winner: socketId,
                    combination: deserialize(SetCombination, combination),
                    showSolution: false,
                    selectedCardsIndex: []
                })
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

    handleClickOnCard = (k) => {
        if(!this.state.hasAlreadyPlayed && !this.state.combination) {
            this.setState({ selectedCardsIndex: 
                this.state.selectedCardsIndex.indexOf(k) === -1
                ? this.state.selectedCardsIndex.concat(k)
                : this.state.selectedCardsIndex.filter(key => key !== k)
            },
            () => {
                if(this.state.selectedCardsIndex.length === 3){
                    this.sendCombination()
                }
            })
        }
    }

    getSelectedCards(){
        return this.state.selectedCardsIndex.map(index => this.state.field.cards[index])
    }

    sendCombination = () => {
        if(this.state.selectedCardsIndex.length === 3 && !this.state.hasAlreadyPlayed){
            this.props.socket.emit(prefix + 'game:play', this.getSelectedCards())
            this.setState({
                selectedCardsIndex: []
            })
        }
    }

    // MASTER MODE
    addCards = () => {
        this.props.socket.emit(prefix + 'game:add-cards')
    }
    showSolution = () => {
        this.setState({showSolution: true})
    }

    render() {
        console.log('test state before render', this.state.combination)
        return (
            <div className='game set-game'>
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
                    [
                        <Field
                            cards={this.state.field.cards}
                            selectedCardsIndex={this.state.selectedCardsIndex}
                            handleClick={this.handleClickOnCard}
                            hasAlreadyPlayed={this.state.hasAlreadyPlayed}
                            combination={this.state.combination}
                            showSolution={this.state.showSolution}
                        />,
                        <div className="player-action">
                            {this.props.ui.username === 'MASTER' && 
                                <Button variant="raised"
                                    onClick={this.addCards}
                                >
                                    Add Cards
                                </Button>
                            }
                            {this.props.ui.username === 'MASTER' && 
                                <Button variant="raised"
                                    onClick={this.showSolution}
                                >
                                    Show solution
                                </Button>
                            }
                            {/*
                            //     <Button className='send-combination-btn'
                            //         onClick={this.sendCombination}
                            //         variant='raised'
                            //         disabled={this.state.hasAlreadyPlayed || this.state.selectedCardsIndex.length !== 3}
                            //     >Send</Button>
                            */}
                        </div>
                        ,
                        <div className="infos-zone">
                            {this.state.hasAlreadyPlayed ? 
                                'You did an error, you will be able to play on next turn...'
                            : (this.state.combination ?
                                (this.state.winner === this.props.socket.id ? 'You' : 'Someone') + ' found the solution. You can see it on field. Wait a moment, the next turn will start shortly!'
                                : 'You have to found a combination of three cards with same or all different shapes, with same or all different filling, with same or all different color, with same or all different number'
                            )}
                        </div>
                    ]}

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
