import * as React from 'react';
import {socketConnect} from 'socket.io-react'
import {observer, inject} from 'mobx-react';
import { DefaultProps, injector } from '../../mobxInjector'

import {GameLobbyList, GameStatus, GameType} from 'limitelimite-common'
import Chat from '../../components/Chat';
import { Button, Switch, FormControlLabel } from '@material-ui/core';
import { RouteEnum } from '../../Router/Route';

import './lobby.scss'

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
            this.props.socket.emit('lobby:get_global_lobby_list')

            this.props.socket.on('lobby:player.enter_in_game_table', (gameType: GameType) => {
                console.log('where to go', gameType, GameType.TarotCongolais)
                switch (gameType) {
                    case GameType.LimiteLimite:                
                        this.props.ui.router.switchRoute(RouteEnum.LimiteLimite)
                        document.title = 'Limite Limite';
                        break;
                    case GameType.TarotCongolais:
                        this.props.ui.router.switchRoute(RouteEnum.TarotCongolais)
                        document.title = 'Tarot Congolais';
                        break;
                    case GameType.GifDefinitor:
                        this.props.ui.router.switchRoute(RouteEnum.GifDefinitor)
                        document.title = 'Gif Definitor';
                        break;
                }
            })

            this.props.socket.on('lobby:player.update_list', (gameList: GameLobbyList) => {
                this.setState({ gameList })
            })
        }
    }

    renderGamesTable(){
        console.log('lobby list', this.state.gameList)

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
                {/* Main content */}
                <div className='game-lobby-content'>
                    <div className="lobby-type-selection">
                        <div className="lobby-type-selection-title"></div>
                        <div className="lobby-type-selection-list">
                            <div className="lobby-type-selection-elt">
                                <div className="lobby-type-selection-elt-image"></div>
                                <div className="lobby-type-selection-elt-descriptor">
                                    <div className="type-descriptor-title"></div>
                                    <div className="type-descriptor-description"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="lobby-game-join-or-create">
                        <div className="lobby-game-list"></div>
                            <div className="lobby-game-list-title"></div>
                            <div className="lobby-game-list-filters"></div>
                            <div className="lobby-game-list-grid">
                                <div className="lobby-game-list-elt"></div>
                            </div>
                        <div className="lobby-game-creator">
                            <div className="lobby-game-creator-form"></div>
                        </div>
                    </div>
                </div>

                {/* Lobby */}
                <div className="game-lobby-chat">
                    <Chat channel='lobby' />
                </div>
            </div>
        );
    }
}

export default GameLobby;
