import * as React from 'react';
import {socketConnect} from 'socket.io-react'
import {observer, inject} from 'mobx-react';
import { DefaultProps, injector } from '../../mobxInjector'

import {GameLobbyList, GameStatus} from 'boardgamereactio-common'
import Chat from '../../components/Chat';
import { Button, Switch, FormControlLabel } from '@material-ui/core';
import { RouteEnum } from '../../Router/Route';

import './lobby.scss'
import GameForm from './parts/GameForm';
import GameList from './parts/GameList';
import TypeSelector from './parts/TypeSelector';

interface GameLobbyProps extends DefaultProps {
}
interface GameLobbyState {
}

@inject(injector)
@observer
@socketConnect
class GameLobby extends React.Component <GameLobbyProps, GameLobbyState> {

    constructor(props: GameLobbyProps){
        super(props)
        this.state = {
        }
    }

    componentDidMount(){
        if(this.props.socket){
            this.props.socket.on('lobby:player.enter_in_game_table', (gameIdentifier: string) => {
                this.props.ui.router.switchRoute(gameIdentifier)
            })
        }
    }

    render() {
        return (
            <div className="game-lobby">
                {/* Main content */}
                <div className='game-lobby-content'>
                    {/* <div className="lobby-type-selection"> */}
                    <TypeSelector /> 
                    
                    <div className="lobby-game-join-or-create">
                        {/* <div className="lobby-game-list"> */}
                        <GameList />

                        <div className="join-or-create-separator" />

                        {/* <div className="lobby-game-creator"> */}
                        <GameForm />
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
