import * as React from 'react';
import {socketConnect} from 'socket.io-react'
import {observer, inject} from 'mobx-react';
import { DefaultProps, injector } from '../../mobxInjector'
import {deserialize} from 'serializr'

import { prefix, Bet, Play, GamePhase } from 'boardgamereactio-common/TarotCongolais/TarotCongolais'
import { Hand } from 'boardgamereactio-common/TarotCongolais/Hand'
import { Card as TCCard } from 'boardgamereactio-common/TarotCongolais/Card'

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
    nbPlayersToStart: number,
    isLastPlayer?: boolean

    // to build game states
    gamePhase?: GamePhase
    isPlayerToBet?: boolean
    isPlayerToPlay?: boolean
    isGameOver?: boolean
    nbTurnCards?: number

    // game elts
    bets?: Bet[]
    plays?: Play[]
    otherPlayersSoloCards?: TCCard[]
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
            nbPlayersToStart: 0
        }
    }

    componentDidMount(){
        if(this.props.socket){
            const socket = this.props.socket
            socket.emit(prefix + 'game:ask_initial_infos')

            socket.on(prefix + 'game:player.ask_initial_infos', (gameId: string, players: any[], isCreator: boolean, nbPlayersToStart: number) => {
                this.setState({gameId, players, isCreator, nbPlayersToStart })
            })

            socket.on(prefix + 'game:players.new_player', (players: any) => {
                this.setState({ players })
            })


            // socket.on(prefix + 'game:player.new_bet', (bets: Bet[], isPlayerToBet: boolean) => {
            //     this.setState({ isPlayerToBet, bets })
            // })

            // socket.on(prefix + 'game:player.new_solo_bet', (bets: Bet[], isPlayerToBet: boolean, otherPlayersCards: TCCard[] ) => {
            //     this.setState({ isPlayerToBet, bets })
            // })

            // socket.on(prefix + 'game:player.new_play', (plays: Play[], isPlayerToPlay: boolean) => {
            //     this.setState({ plays, isPlayerToPlay })
            // })

            socket.on(prefix + 'game:players.update', (isGameOver: boolean, nbTurnCards: number, gamePhase: GamePhase, bets: Bet[], plays: Play[], isPlayerToBet: boolean, isPlayerToPlay: boolean, handJSON: any, otherPlayersSoloCards: TCCard[], isLastPlayer: boolean) => {
                console.log('on update ui', { isGameOver, gamePhase, bets, plays, isPlayerToBet, isPlayerToPlay, handJSON, otherPlayersSoloCards, isLastPlayer })
                this.setState({ 
                    isGameOver, 
                    gamePhase, 
                    bets, 
                    plays, 
                    isPlayerToBet, 
                    isPlayerToPlay, 
                    hand: handJSON ? deserialize(Hand, handJSON) : undefined,
                    otherPlayersSoloCards, 
                    nbTurnCards,
                    isLastPlayer 
                })
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
                className={'player'}  
            >
                <div className="player-pv">{p.pv}</div>
                <div className="player-name">{p.name}</div>
                { !!this.state.gamePhase && <div className="player-trick-zone">
                        <div className="player-tricks">{p.nbTricks}</div>
                        <div className="player-separator-tricks-bet">/</div>
                        <div className="player-bet">{ (!!p.bet || p.bet === 0) ? p.bet : '?'}</div>   
                    </div>
                }
            </div>
        )
    }

    get impossibleBetForLastPlayer(){
        return this.state.isLastPlayer 
            ? this.state.nbTurnCards - this.state.players.reduce( (sumBets, p) => sumBets + (p.bet || 0), 0)
            : undefined
    }

    handleChangeExcuseValue = (cardIndex: number) => {
        console.log('change excuse value')
        const newCards = this.state.hand.cards.map( (c, k) => {
            if(k === cardIndex){
                c.isExcuse() && c.switchExcuseValue()
            }
            return c
        })
        this.setState({
            hand: new Hand(newCards)
        })
    }

    handleBet = (betValue: number) => {
        console.log('bet to send', betValue)
        this.props.socket.emit(prefix + 'player_bet', betValue)
    }

    handleSoloPrediction = (iHaveTheBiggest: boolean) => {
        const betValue = iHaveTheBiggest ? 1 : 0
        console.log('prediction chosen', betValue)
        this.props.socket.emit(prefix + 'player_bet', betValue)
    }

    handlePlay = (cardIndex: number) => {
        console.log('play', cardIndex)
        this.props.socket.emit(prefix + 'player_play', cardIndex)
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
                    { !this.state.gamePhase && !isGameOver &&
                        <BeforeGameStart
                            gameId={this.state.gameId}
                            isCreator={this.state.isCreator}
                            nbPlayers={this.state.players.length}
                            nbPlayersToStart={this.state.nbPlayersToStart}
                            startGame={this.startGame}
                        />
                    }

                    { this.state.gamePhase && this.state.gamePhase === GamePhase.Bet && nbTurnCards > 1 &&
                        <BetPhase
                            hand={hand}
                            onValidateBet={this.handleBet}
                            isPlayerToBet={isPlayerToBet}
                            impossibleBetForLastPlayer={this.impossibleBetForLastPlayer}
                            onChangeExcuseValue={this.handleChangeExcuseValue}
                        />
                    }

                    { this.state.gamePhase && this.state.gamePhase === GamePhase.Play && nbTurnCards > 1 &&  
                        <TrickPhase
                        hand={hand}
                        onPlay={this.handlePlay}
                        otherPlayersTricks={this.state.plays}
                        isPlayerToPlay={isPlayerToPlay}
                        onChangeExcuseValue={this.handleChangeExcuseValue}
                        />
                    }
                    
                    { this.state.gamePhase && this.state.gamePhase === GamePhase.Bet && nbTurnCards === 1 && 
                        <SoloCardPhase
                            onPrediction={this.handleSoloPrediction}
                            otherPlayersCards={this.state.otherPlayersSoloCards}
                            isPlayerToBet={isPlayerToBet}
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
