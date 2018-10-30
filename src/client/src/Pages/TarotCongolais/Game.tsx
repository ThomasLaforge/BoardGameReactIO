import * as React from 'react';
import {socketConnect} from 'socket.io-react'
import {observer, inject} from 'mobx-react';
import { DefaultProps, injector } from '../../mobxInjector'
import {deserialize, serialize} from 'serializr'

import {PlayerListUI, PlayerListUIElt} from 'limitelimite-common/LimiteLimiteUI'
import { prefix, Bet, Play, GamePhase } from 'limitelimite-common/TarotCongolais/TarotCongolais'
import { Hand } from 'limitelimite-common/TarotCongolais/Hand'
import { Card as TCCard } from 'limitelimite-common/TarotCongolais/Card'

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
    myIndex: number,
    nbPlayersToStart: number,

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
            myIndex: 0,
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

            socket.on(prefix + 'game:players.new_player', (players: PlayerListUI) => {
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

            socket.on(prefix + 'game:players.update', (isGameOver: boolean, gamePhase: GamePhase, bets: Bet[], plays: Play[], isPlayerToBet: boolean, isPlayerToPlay: boolean, hand: Hand, otherPlayersSoloCards: TCCard[]) => {
                this.setState({ isGameOver, gamePhase, plays, isPlayerToPlay, bets, isPlayerToBet, hand, otherPlayersSoloCards })
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
        this.props.socket.emit(prefix + 'player_bet', betValue)
    }

    handleSoloPrediction = (answer: boolean) => {
        console.log('prediction chosen', answer)
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
                    { !isPlayerToBet && !isPlayerToPlay && !isGameOver &&
                        <BeforeGameStart
                            gameId={this.state.gameId}
                            isCreator={this.state.isCreator}
                            nbPlayers={this.state.players.length}
                            nbPlayersToStart={this.state.nbPlayersToStart}
                            startGame={this.startGame}
                        />
                    }

                    {/* Must be this one but ts weird error ... */}
                    {/* { this.state.gamePhase && this.state.gamePhase === GamePhase.Bet && this.state.gamePhase &&  */}
                    { this.state.gamePhase && this.state.gamePhase !== GamePhase.Play && this.state.gamePhase && 
                        <BetPhase
                            hand={hand}
                            onValidateBet={this.handleBet}
                            isPlayerToBet={isPlayerToBet}
                        />
                    }

                    { this.state.gamePhase && this.state.gamePhase === GamePhase.Play && nbTurnCards === 1 && 
                        <SoloCardPhase
                            onPrediction={this.handleSoloPrediction}
                            otherPlayersCards={this.state.otherPlayersSoloCards}
                            isPlayerToPlay={isPlayerToPlay}
                        />
                    }

                    { !!isPlayerToPlay && nbTurnCards > 1 &&  
                        <TrickPhase
                            hand={hand}
                            onPlay={this.handlePlay}
                            otherPlayersTricks={this.state.plays}
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
