import * as React from 'react';
import {socketConnect} from 'socket.io-react'
import {observer, inject} from 'mobx-react';
import { DefaultProps, injector } from '../mobxInjector'
import Button from '@material-ui/core/Button';
import { GameStatus, DEFAULT_IS_PRIVATE_GAME } from 'limitelimite-common/LimiteLimite';
import Chat from '../components/Chat';
import GameBeforeStart from '../components/GameParts/GameBeforeStart';

console.log('GameStatus', GameStatus, DEFAULT_IS_PRIVATE_GAME)

interface GameProps extends DefaultProps {
}
interface GameState {
    gameId: string
    isCreator: boolean
    isFirstPlayer: boolean
    gameStatus: GameStatus
    playersNames: string[]
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
            playersNames: []
        }
    }

    componentDidMount(){
        if(this.props.socket){
            const socket = this.props.socket
            socket.emit('game:ask_initial_infos')

            socket.on('game:player.ask_initial_infos', (gameId: string, isCreator: boolean) => {
                this.setState({gameId, isCreator})
            })
            socket.on('game:start_turn', (gameId: string, isFirstPlayer: boolean) => {
                this.setState({isFirstPlayer, gameId})
            })
        }
    }

    renderPlayers(){
        return this.state.playersNames.map(pName => 
            <div className="player-name">{pName}</div>    
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
                            isFirstPlayer={this.state.isFirstPlayer}
                            isCreator={this.state.isCreator}
                            nbPlayers={this.state.playersNames.length}
                            gameId={this.state.gameId}
                        />
                    }                
                </div>
            </div>
        );
    }
}

export default Game;
