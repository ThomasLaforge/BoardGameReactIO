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
    players: any[]
    nbPlayers: number

    selectedCardsIndex: number
    stackValues: number[]
    opponentCards: CardModel[]
    cards: CardModel[]
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
            stackValues: [null, null],
            nbPlayers: 0,
            cards: [],
            opponentCards: []
        }
    }

    componentDidMount(){
        if(this.props.socket){

            const socket = this.props.socket

            socket.emit(prefix + 'game:ask_initial_infos')

            socket.on(prefix + 'game:player.ask_initial_infos', (gameId: string, players: any, isCreator: boolean, nbPlayers: number) => {
                console.log('players1', gameId, players, isCreator, nbPlayers)
                this.setState({gameId, isCreator, players, nbPlayers })
            })
            socket.on(prefix + 'game:players.new_player', (players) => {
                console.log('players2', players)
                this.setState({ players })
            })

            socket.on(prefix + 'game:players.update', (isGameOver, myCards, opponentCards, stackValues) => {
                console.log('game:players.update', isGameOver, myCards, opponentCards, stackValues)
                this.setState({
                    gameStatus: isGameOver ? GameStatus.Finished : GameStatus.InGame,
                    cards: myCards,
                    opponentCards,
                    stackValues
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
                <div className="player-nb-cards">{p.nbCards}</div>
            </div>
        )
    }

    handleStress = () => {
        this.props.socket.emit(prefix + 'game:stress')
    }

    selectCard = (index: number) => {
        console.log('click on card', index)
        this.setState({
            selectedCardsIndex: this.state.selectedCardsIndex === index ? undefined : index
        })
    }

    handleStackClick = (stackIndex: number) => {
        console.log('click on stack', stackIndex, this.state.selectedCardsIndex)
        if(this.state.selectedCardsIndex || this.state.selectedCardsIndex === 0){
            this.props.socket.emit(prefix + 'game:add-card', this.state.selectedCardsIndex, stackIndex)
        }
        else {
            console.log('select a card before click on stack')
        }
    }

    renderStacks(){
        console.log('stacks to render', this.state.stackValues);
        
        return this.state.stackValues.map((v, i) => (
            <Stack key={i} value={v} onClick={() => this.handleStackClick(i)}/>
        ))
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
                                cards={this.state.opponentCards}
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
                                cards={this.state.cards}
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
