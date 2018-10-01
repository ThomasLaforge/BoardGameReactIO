import * as React from 'react';
import {socketConnect} from 'socket.io-react'
import {observer, inject} from 'mobx-react';
import { DefaultProps, injector } from '../mobxInjector'

import {GameLobbyList, GameStatus} from 'limitelimite-common'
import Chat from '../components/Chat';
import { Button } from '@material-ui/core';
import { RouteEnum } from '../Router/Route';

interface GameLobbyProps extends DefaultProps {
}
interface GameLobbyState {
    gameList: GameLobbyList
}

@inject(injector)
@observer
@socketConnect
class GameLobby extends React.Component <GameLobbyProps, GameLobbyState> {

    constructor(props: GameLobbyProps){
        super(props)
        this.state = {
            gameList: []
        }
    }

    componentDidMount(){
        if(this.props.socket){
            this.props.socket.on('lobby:player.enter_in_game_table', () => {
                this.props.ui.router.switchRoute(RouteEnum.Game)
            })
        }
    }

    renderGamesTable(){
        return <div className='game-lobby-table'>
            <table>
                <thead>
                    <tr>
                        <th>Game ID</th>
                        <th>People</th>
                        <th>State</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.gameList.map(gInfo => (
                        <tr>
                            <td>{gInfo.gameId}</td>
                            <td>{gInfo.people}</td>
                            <td>{gInfo.isFull ? 'full' : 'free'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    }

    render() {
        return (
            <div className="game-lobby">
                {/* <PlayerMiniInfo /> */}
                <div className='game-lobby-choices'>
                    <div className='game-lobby-category'>
                        <div className='lobby-category-title'>Chose a game</div>
                        <div className='lobby-category-description'></div>
                        <div className='lobby-category-content'>
                            {this.renderGamesTable()}
                        </div>
                    </div>
                    <div className='game-lobby-category'>
                        <div className='lobby-category-title'>Create new game</div>
                        <div className='lobby-category-description'></div>
                        <div className='lobby-category-content'>
                        </div>
                    </div>
                    <div className='game-lobby-category'>
                        <div className='lobby-category-title'>Auto</div>
                        <div className='lobby-category-description'></div>
                        <div className='lobby-category-content'>
                            <Button onClick={() => this.props.socket.emit('lobby:auto')}>Find a game</Button>
                        </div>
                    </div>
                </div>
                <div className="game-lobby-chat">
                    <Chat />
                </div>
            </div>
        );
    }
}

export default GameLobby;
