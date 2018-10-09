import * as React from 'react';
import {socketConnect} from 'socket.io-react'
import {observer, inject} from 'mobx-react';
import { DefaultProps, injector } from '../../mobxInjector'

import {GameLobbyList, GameStatus} from 'limitelimite-common'
import Chat from '../../components/Chat';
import { Button, Switch, FormControlLabel } from '@material-ui/core';
import { RouteEnum } from '../../Router/Route';

import './game_lobby.scss'

interface GameLobbyProps extends DefaultProps {
}
interface GameLobbyState {
    gameList: GameLobbyList,
    switchPrivateState: boolean
}

@inject(injector)
@observer
@socketConnect
class GameLobby extends React.Component <GameLobbyProps, GameLobbyState> {

    constructor(props: GameLobbyProps){
        super(props)
        this.state = {
            gameList: [],
            switchPrivateState: true
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

    handleSwitchPrivate = () => {
        this.setState({ switchPrivateState: !this.state.switchPrivateState })
    }

    render() {
        return (
            <div className="game-lobby">
                {/* <PlayerMiniInfo /> */}
                <div className='game-lobby-choices'>
                    {/* <div className='game-lobby-category game-lobby-category-chose'>
                        <div className='lobby-category-title'>Chose a game</div>
                        <div className='lobby-category-description'></div>
                        <div className='lobby-category-content'>
                            {this.renderGamesTable()}
                        </div>
                    </div>
                    <div className='game-lobby-category game-lobby-category-create'>
                        <div className='lobby-category-title'>Create new game</div>
                        <div className='lobby-category-description'>
                            Create a new game
                        </div>
                        <div className='lobby-category-content'>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={this.state.switchPrivateState}
                                        onChange={this.handleSwitchPrivate}
                                    />
                                }
                                label="Private"
                            />
                            <Button onClick={() => this.props.socket.emit('lobby:create')}>Create a game</Button>
                        </div>
                    </div> */}
                    <div className='game-lobby-category game-lobby-category-auto'>
                        {/* <div className='lobby-category-title'>Auto</div>
                        <div className='lobby-category-description'>
                            Find a public game or create one
                        </div> */}
                        <div className='lobby-category-content'>
                            <Button 
                                className='lobby-btn'
                                variant='raised'
                                onClick={() => this.props.socket.emit('lobby:auto')}
                            >
                                Find a game
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="game-lobby-chat">
                    <Chat channel='lobby' />
                </div>
            </div>
        );
    }
}

export default GameLobby;
