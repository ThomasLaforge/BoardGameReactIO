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

interface GameProps extends DefaultProps {
}
interface GameState {
    gameId: string
    isCreator: boolean
    gameStatus: GameStatus
    players: any

    field: SetField
    selectedCardsIndex: number[]
    hasAlreadyPlayed: boolean
    isGameOver: boolean
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
            isGameOver: false
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

            socket.on(prefix + 'game:mp.start', (sentenceJSON) => {
                console.log('game:mp.start', sentenceJSON)
                this.setState({
                    gameStatus: GameStatus.InGame,
                })
            })
            
            socket.on(prefix + 'game:op.start', (sentenceJSON, handJSON) => {
                console.log('game:op.start', sentenceJSON, handJSON)
                this.setState({
                    gameStatus: GameStatus.InGame
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
            </div>
        )
    }

    handleClick = (k) => {
        if(!this.state.hasAlreadyPlayed) {
            this.setState({ selectedCardsIndex: 
                this.state.selectedCardsIndex.indexOf(k) === -1
                ? this.state.selectedCardsIndex.concat(k)
                : this.state.selectedCardsIndex.filter(key => key !== k)
            })
        }
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
                    {this.state.isGameOver && 
                        <GameResult />
                    }
                    {!this.state.isGameOver && this.state.gameStatus === GameStatus.InGame && 
                    [
                        <Field
                            cards={this.state.field.cards}
                            selectedCardsIndex={this.state.selectedCardsIndex}
                            handleClick={this.handleClick}
                            hasAlreadyPlayed={this.state.hasAlreadyPlayed}
                        />,
                        <Button className='' 
                            variant='raised'
                        >Send</Button>
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
