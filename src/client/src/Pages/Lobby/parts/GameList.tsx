import * as React from 'react';
import {socketConnect} from 'socket.io-react'
import { DefaultProps, injector } from '../../../mobxInjector'
import { GameLobbyList } from 'limitelimite-common';

interface GameListProps extends DefaultProps {
}
interface GameListState {
    gameList: any
}

@socketConnect
class GameList extends React.Component <GameListProps, GameListState> {

    constructor(props: GameListProps){
        super(props)
        this.state = {
            gameList: []
        }
    }

    componentDidMount(){
        if(this.props.socket){
            this.props.socket.emit('lobby:get_global_lobby_list')
        }

        this.props.socket.on('lobby:player.update_list', (gameList: GameLobbyList) => {
            this.setState({ gameList })
        })
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

    render() {
        return (
            <div className="lobby-game-list">
                <div className="lobby-game-list-title"></div>
                <div className="lobby-game-list-filters"></div>
                <div className="lobby-game-list-grid">
                    <div className="lobby-game-list-elt"></div>
                </div>
            </div>
        );
    }
}

export default GameList;