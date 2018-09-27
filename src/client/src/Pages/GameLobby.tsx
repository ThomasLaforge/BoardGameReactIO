import * as React from 'react';
import {socketConnect} from 'socket.io-react'
import {observer, inject} from 'mobx-react';
import { DefaultProps, injector } from '../mobxInjector'

import {GameLobbyList} from 'limitelimite-common'
import Chat from '../components/Chat';

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
            // this.props.socket.on('login_accepted', (username) => {})
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
                            <td>{gInfo.state}</td>
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
                </div>
                <div className="game-lobby-chat">
                    <Chat />
                </div>
            </div>
        );
    }
}

export default GameLobby;
