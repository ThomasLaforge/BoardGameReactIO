import * as React from 'react';
import {socketConnect} from 'socket.io-react'
import {observer, inject} from 'mobx-react';
import { DefaultProps, injector } from '../mobxInjector'
import Button from '@material-ui/core/Button';
import { GameStatus, DEFAULT_IS_PRIVATE_GAME } from 'limitelimite-common';
import {PlayerListUI, PlayerListUIElt} from 'limitelimite-common/LimiteLimiteUI'
import Chat from '../components/Chat';
import GameBeforeStart from '../components/GameParts/GameBeforeStart';
import { ChatMessage } from '../../node_modules/limitelimite-common/Server';
import GameMainPlayer from '../components/GameParts/GameMainPlayer';
import GamePropositionPlayer from '../components/GameParts/GamePropositionPlayer';
import GameResult from '../components/GameParts/GameResult';

console.log('GameStatus', GameStatus, DEFAULT_IS_PRIVATE_GAME)

interface GameProps extends DefaultProps {
}
interface GameState {
    gameId: string
    isCreator: boolean
    isFirstPlayer: boolean
    gameStatus: GameStatus
    players: PlayerListUI

    sentence?: any
    propositions?: any
    chosenProposition?: any
    hand?: any
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
            players: []
        }
    }

    componentDidMount(){
        if(this.props.socket){
            const socket = this.props.socket
            socket.emit('game:ask_initial_infos')

            socket.on('game:player.ask_initial_infos', (gameId: string, players: PlayerListUI, isCreator: boolean, initialChat: ChatMessage[]) => {
                console.log('players1', gameId, players, isCreator, initialChat)
                this.setState({gameId, isCreator, players })
            })
            socket.on('game:players.new_player', (players: PlayerListUI) => {
                console.log('players2', players)
                this.setState({ players })
            })

            socket.on('game:players.start', () => {
                this.setState({ gameStatus: GameStatus.InGame })
            })
            game:mp.start', sentence)
            game:op.start, sentence, hand

            socket.on('game:players.turn_to_resolve', () => {
                this.setState({ gameStatus: GameStatus.Result })
            })

            game:player.player_has_played
            game:mp.new_turn', sentence
            'game:op.new_start', sentence, hand)
        }
    }

    renderPlayers(){
        console.log('show players', this.state.players)
        return this.state.players.map( (p: PlayerListUIElt, k) => 
            <div className="player" key={k}>
                <div className="player-name">{p.name}</div>   
                <div className="player-score">{p.score}</div>
                <div className="player-first-player">{p.isFirstPlayer ? 'boss' : ''}</div>
            </div>
        )
    }

    startGame = () => {
        this.props.socket.emit('game:start')
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

                    {this.state.gameStatus === GameStatus.Preparing && this.state.isFirstPlayer &&
                        <GameMainPlayer
                            sentence={this.state.sentence}
                            propositions={this.state.propositions}
                        />
                    }                 
                    
                    {this.state.gameStatus === GameStatus.Preparing && !this.state.isFirstPlayer &&
                        <GamePropositionPlayer
                            sentence={this.state.sentence}
                            hand={this.state.hand}
                        />
                    }

                    
                    {/* {this.state.gameStatus === GameStatus.Result &&
                        <GameResult
                            sentence={this.state.sentence}
                            propositions={this.state.propositions}
                            chosenProposition={this.state.chosenProposition}
                        />
                    }                  */}
                </div>
            </div>
        );
    }
}

export default Game;
